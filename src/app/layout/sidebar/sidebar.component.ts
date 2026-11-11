import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import {
  faLandmark,
  faHouse,
  faHammer,
  faChartLine,
  faTriangleExclamation,
  faRecycle,
  faMap,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  label: string;
  icon: IconDefinition;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  // Ícone da identidade visual
  readonly faLandmark: IconDefinition = faLandmark;

  // Itens de navegação
  readonly menuItems: MenuItem[] = [
    { label: 'Visão geral', icon: faHouse, route: '/' },
    { label: 'Obras públicas', icon: faHammer, route: '/obras' },
    { label: 'Transparência', icon: faChartLine, route: '/transparencia' },
    {
      label: 'Infraestrutura',
      icon: faTriangleExclamation,
      route: '/infraestrutura',
    },
    { label: 'Serviços urbanos', icon: faRecycle, route: '/servicos' },
    { label: 'Mapa da cidade', icon: faMap, route: '/mapa' },
  ];

  // Navegação complementar
  readonly faCircleInfo: IconDefinition = faCircleInfo;
}
