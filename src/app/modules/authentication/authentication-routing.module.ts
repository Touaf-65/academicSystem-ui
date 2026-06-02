import { Routes } from '@angular/router';

import { Authentication } from './authentication';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { NewPassword } from './pages/new-password/new-password';
import { SignIn } from './pages/sign-in/sign-in';
import { SignUp } from './pages/sign-up/sign-up';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: Authentication,
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      },
      {
        path: 'sign-in',
        component: SignIn,
        data: {
          returnUrl: window.location.pathname
        }
      },
      {
        path: 'sign-up',
        component: SignUp
      },
      {
        path: 'forgot-password',
        component: ForgotPassword
      },
      {
        path: 'new-password',
        component: NewPassword
      },
      {
        path: '**',
        redirectTo: 'sign-in'
      }
    ]
  }
];