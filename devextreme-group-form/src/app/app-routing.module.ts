import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { DxCheckBoxModule, DxDataGridModule, DxFormComponent, DxFormModule, DxNumberBoxModule, DxSelectBoxModule, DxTextAreaModule } from 'devextreme-angular';
import { AdaptiveComponent } from './pages/adaptive/adaptive.component';
import { CustomizeComponent } from './pages/customize/customize.component';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'adaptive',
    component: AdaptiveComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'customize',
    component: CustomizeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule, DxDataGridModule, DxFormModule, DxCheckBoxModule, DxTextAreaModule, DxSelectBoxModule, DxNumberBoxModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [HomeComponent, ProfileComponent, TasksComponent, AdaptiveComponent, CustomizeComponent]
})
export class AppRoutingModule { }
