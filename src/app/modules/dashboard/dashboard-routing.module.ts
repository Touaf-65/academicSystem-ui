import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { Vue } from './pages/vue/vue';
import { Echeance } from './pages/echeance/echeance';
import { Journal } from './pages/journal/journal';
import { Entreprise } from './pages/entreprise/entreprise';
import { Profile } from './pages/profile/profile';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
        { path:'', redirectTo: 'vue', pathMatch: 'full'},
        { path: 'vue', component: Vue },
        { path: 'echeance', component: Echeance },
        { path: 'journal', component: Journal },
        { path: 'entreprise', component: Entreprise },
        { path: 'profile', component: Profile }

    ]
  }
];



// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { Dashboard } from './dashboard';
// const routes: Routes = [
//   {
//     path:'',
//     component: Dashboard,
//     children:[
//     ]
//   }
// ];
// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class DashboardRoutingModule { }
