import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
     path : 'login',
     component: LoginComponent
  },
  {
    path : 'signup',
    component: SignupComponent
 },
 {
  path : '',
  component: DashboardComponent,
  canActivate : [ AuthGuard]
 },
  {path : '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
