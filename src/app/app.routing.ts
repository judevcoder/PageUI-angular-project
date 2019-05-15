import {Routes} from '@angular/router';
//Layouts
import { SimplyWhiteLayout } from './@pages/layouts';
import { AuthLoginLayout } from './@pages/layouts';
import { RegisterLayout } from './@pages/layouts';
import { ForgotPasswordLayout } from './@pages/layouts';
import { LogoutComponent } from './@pages/layouts';
import { AuthGuard } from "./@pages/layouts/auth/_guards/auth.guard";

export const AppRoutes: Routes = [

  // {path: '', redirectTo: 'pages', pathMatch: 'prefix'},
  { path: 'login', component: AuthLoginLayout },
  { path: 'register', component: RegisterLayout },
  { path: 'forgot-password', component: ForgotPasswordLayout },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
  {
    path: '',
    component: SimplyWhiteLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './pages/pages.module#PagesModule'
      }
    ],
  },

];
