import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DefaultComponent } from './components/layouts/default/default.component';
import { UserComponent } from './pages/user/user.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserAddComponent } from './pages/user-add/user-add.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/homepage/homepage.component').then(m => m.HomepageComponent)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'change-password-first-time',
    loadComponent: () => import('./pages/change-password-first-time/change-password-first-time.component').then(m => m.ChangePasswordFirstTimeComponent)
  },
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  //   canActivate:[authGuard]
  // },
   {
    path: 'dashboard',
    component: DefaultComponent,
    children: [
       { path: '', component: DashboardComponent },
      { path: 'users', component: UserComponent },
      {path: 'user-add', component: UserAddComponent}
      // { path: 'settings', component: SettingsComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
