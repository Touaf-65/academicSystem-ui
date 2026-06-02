import { Routes } from '@angular/router';
import { Infrastructure } from './infrastructure';
import { Vue } from './pages/vue/vue';
import {BuildingFloor} from './pages/building-floor/building-floor';
import { Classroom } from './pages/classroom/classroom';

export const INFRASTRUCTURE_ROUTES: Routes = [
  {
    path: '',
    component: Infrastructure,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
      { path: 'build-floors', component: BuildingFloor },
      { path: 'classrooms', component: Classroom },
    ],
  },
];
