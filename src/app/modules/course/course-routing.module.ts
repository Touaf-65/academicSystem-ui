import { Routes } from '@angular/router';
import { Course } from './course';
import { Vue } from './pages/vue/vue';
import { CourseList } from './pages/course-list/course-list';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    component: Course,
    children: [
      { path: '', redirectTo: 'vue', pathMatch: 'full' },
      { path: 'vue', component: Vue },
      { path: 'list', component: CourseList },
    ],
  },
];
