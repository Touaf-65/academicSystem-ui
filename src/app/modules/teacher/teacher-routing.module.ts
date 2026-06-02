import { Routes } from '@angular/router';
import { Teacher } from './teacher';
import { Vue } from './pages/vue/vue';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    component: Teacher,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
    ],
  },
];
