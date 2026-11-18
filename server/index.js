
const express = require('express');
const cheerio = require('cheerio');

const app = express();

const PORT = 3000;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cidade em Ordem API está funcionando'
  });
});

app.get('/api/public-works', async (req, res) => {
  try {
    const response = await fetch(
      'https://indaiatuba.sp.gov.br/obras/obras-publicas/obras/obras-em-andamento/'
    );

    const html = await response.text();

    const $ = cheerio.load(html);

    const tables = $('table');

    const works = [];

    tables.each((index, table) => {
      const rows = $(table).find('tr');

      const title = $(table).find('h4').first().text().trim();

      if (!title) return;

      const address = rows.eq(1).find('td').last().text().trim();
      const startDate = rows.eq(2).find('td').last().text().trim();
      const deliveryDate = rows.eq(3).find('td').last().text().trim();
      const updatedDeliveryRow = rows.filter((index, row) =>
        $(row).text().includes('Previsão de CONCLUSÃO')
      );

      const updatedDeliveryDate = updatedDeliveryRow
        .find('td')
        .last()
        .text()
        .trim();

      const progress = [];

      rows.each((rowIndex, row) => {
        const cells = $(row).find('td');

        if (cells.length !== 4) return;

        const month = cells.eq(0).text().trim();

        // Aceita meses como 9/2026 ou 10/2026
        if (!/^\d{1,2}\/\d{4}$/.test(month)) return;

        progress.push({
          month,
          accumulatedValue: cells.eq(1).text().trim(),
          executedPercentage: cells.eq(2).text().trim(),
          submissionDate: cells.eq(3).text().trim()
        });
      });
      const normalizedProgress = progress.map((item) => ({
        ...item,
        accumulatedValueNumber: Number(
          item.accumulatedValue
            .replace('R$', '')
            .trim()
            .replace(/\./g, '')
            .replace(',', '.')
        ),
        executedPercentageNumber: Number(
          item.executedPercentage.replace('%', '').replace(',', '.')
        )
      }));

      const latestProgress = normalizedProgress.at(-1) ?? null;

      const lastUpdatedAt = latestProgress?.submissionDate ?? null;

      let updateStatus = 'Sem histórico';
      let daysSinceUpdate = null;

      if (lastUpdatedAt) {
        const [day, month, year] = lastUpdatedAt.split('/').map(Number);

        const lastUpdateDate = Date.UTC(year, month - 1, day);
        const today = new Date();

        const todayUTC = Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        daysSinceUpdate = Math.floor(
          (todayUTC - lastUpdateDate) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceUpdate <= 30) {
          updateStatus = 'Recente';
        } else if (daysSinceUpdate <= 60) {
          updateStatus = 'Atenção';
        } else {
          updateStatus = 'Desatualizada';
        }
      }

      let executionStatus = 'Sem dados de execução';

      if (latestProgress) {
        executionStatus =
          latestProgress.executedPercentageNumber >= 100
            ? 'Execução informada como 100%'
            : 'Execução parcial';
      }

      console.log({
        tableIndex: index,
        title,
        startDate,
        deliveryDate,
        updatedDeliveryDate,
        progressCount: progress.length,
        latestExecutedPercentage:
          latestProgress?.executedPercentageNumber ?? null,
        latestProgressSubmissionDate:
          latestProgress?.submissionDate ?? null
      });

      works.push({
        tableIndex: index,
        title,
        address,
        startDate,
        deliveryDate,
        updatedDeliveryDate,
        progress: normalizedProgress,
        latestProgress,
        lastUpdatedAt,
        executionStatus,
        updateStatus,
        daysSinceUpdate
      });
    });

    res.json({
      status: 'ok',
      tablesFound: tables.length,
      worksFound: works.length,
      works
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Não foi possível acessar a página de obras'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
