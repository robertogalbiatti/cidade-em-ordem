
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
      const title = $(table).find('h4').first().text().trim();

      if (title) {
        works.push({
          tableIndex: index,
          title
        });
      }
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
