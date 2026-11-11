import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

import { HomeComponent } from './features/home/home.component';
import { PublicWorksComponent } from './features/public-works/public-works.component';
import { TransparencyComponent } from './features/transparency/transparency.component';
import { InfrastructureComponent } from './features/infrastructure/infrastructure.component';
import { UrbanServicesComponent } from './features/urban-services/urban-services.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'obras',
        component: PublicWorksComponent,
      },
      {
        path: 'transparencia',
        component: TransparencyComponent,
      },
      {
        path: 'infraestrutura',
        component: InfrastructureComponent,
      },
      {
        path: 'servicos',
        component: UrbanServicesComponent,
      },
    ],
  },
];
