import { Routes } from '@angular/router';
import { Department } from './department';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: Department,
    children: [],
  },
];
