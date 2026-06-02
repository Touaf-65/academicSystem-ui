import { Routes } from '@angular/router';
import { Payment } from './payment';
import { Vue } from './pages/vue/vue';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    component: Payment,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
    ],
  },
];
