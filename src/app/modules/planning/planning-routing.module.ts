import { Routes } from '@angular/router';
import { Planning } from './planning';
import { Vue } from './pages/vue/vue';

export const PLANNING_ROUTES: Routes = [
  {
    path: '',
    component: Planning,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
    ],
  },
];
