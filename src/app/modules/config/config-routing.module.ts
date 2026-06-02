import { Routes } from '@angular/router';
import { Config } from './config';
import { Vue } from './pages/vue/vue';

export const CONFIG_ROUTES: Routes = [
  {
    path: '',
    component: Config,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
    ],
  },
];
