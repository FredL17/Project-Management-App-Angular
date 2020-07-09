import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

// Components.
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProjectsComponent } from './projects/projects.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { TasksComponent } from './projects/tasks/tasks.component';
import { NewTaskComponent } from './projects/tasks/new-task/new-task.component';
import { EditTaskComponent } from './projects/tasks/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsComponent,
    NewProjectComponent,
    LoginComponent,
    SignupComponent,
    EditProjectComponent,
    TasksComponent,
    NewTaskComponent,
    EditTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FontAwesomeModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
