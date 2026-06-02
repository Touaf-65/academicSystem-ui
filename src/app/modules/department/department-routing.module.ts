import { Routes } from '@angular/router';
import { Department } from './department';
import { Vue } from './pages/vue/vue';
import { Program } from './pages/program/program';
import { Cycle } from './pages/cycle/cycle';
import { Level } from './pages/level/level';
import { Class } from './pages/class/class';

export const DEPARTMENT_ROUTES: Routes = [
  {
    path: '',
    component: Department,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
      { path: 'programs', component: Program },
      { path: 'cycles', component: Cycle },
      { path: 'levels', component: Level },
      { path: 'classrooms', component: Class },
    ],
  },
];
