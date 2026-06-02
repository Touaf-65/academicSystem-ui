import { Routes } from '@angular/router';
import { Layout } from './layout';
import { INFRASTRUCTURE_ROUTES } from '../infrastructure/infrastructure-routing.module';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard-routing.module').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('../department/department-routing.module').then((m) => m.DEPARTMENT_ROUTES),
      },
      {
        path: 'infrastructures',
        loadChildren: () =>
          import('../infrastructure/infrastructure-routing.module').then(
            (m) => m.INFRASTRUCTURE_ROUTES,
          ),
      },
      {
        path: 'courses',
        loadChildren: () => import('../course/course-routing.module').then((m) => m.COURSE_ROUTES),
      },
      {
        path: 'teachers',
        loadChildren: () =>
          import('../teacher/teacher-routing.module').then((m) => m.TEACHER_ROUTES),
      },
      {
        path: 'schooling',
        loadChildren: () =>
          import('../schooling/schooling-routing.module').then((m) => m.SCHOOLING_ROUTES),
      },
      {
        path: 'planning',
        loadChildren: () =>
          import('../planning/planning-routing.module').then((m) => m.PLANNING_ROUTES),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('../payment/payment-routing.module').then((m) => m.PAYMENT_ROUTES),
      },
      {
        path: 'config',
        loadChildren: () => import('../config/config-routing.module').then((m) => m.CONFIG_ROUTES),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
