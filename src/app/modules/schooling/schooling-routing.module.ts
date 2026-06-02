import { Routes } from '@angular/router';
import { Schooling } from './schooling';
import { Vue } from './pages/vue/vue';
import { Student } from './pages/student/student';
import { Enrollment } from './pages/enrollment/enrollment';
import { Group } from './pages/group/group';

export const SCHOOLING_ROUTES: Routes = [
  {
    path: '',
    component: Schooling,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
      { path: 'students', component: Student },
      { path: 'enrollments', component: Enrollment },
      { path: 'groups', component: Group },
    ],
  },
];
