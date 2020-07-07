import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './services/auth.guard';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { NewTaskComponent } from './projects/tasks/new-task/new-task.component';
import { EditTaskComponent } from './projects/tasks/edit-task/edit-task.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  {
    path: 'new-project',
    component: NewProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:projectId/new-task',
    component: NewTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:projectId/edit-task/:taskId',
    component: EditTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-project/:id',
    component: EditProjectComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
