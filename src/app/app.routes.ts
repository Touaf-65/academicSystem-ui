import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout-routing.module').then(m => m.LAYOUT_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication-routing.module').then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
