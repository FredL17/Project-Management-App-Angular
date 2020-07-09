import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
// Models.
import { project } from '../models/project.model';
// Services.
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // Subjects for cross-component communication.
  projectListSubject: Subject<project[]> = new Subject();
  loadingSubject: Subject<boolean> = new Subject();
  errorSubject: Subject<string> = new Subject();
  // Local variables.
  readonly ROOT_URL: string = 'http://localhost:3000/projects';
  private projectList: project[] = [];
  private error: string = '';
  private loading: boolean = false;

  constructor(
    private taskService: TaskService,
    private http: HttpClient,
    private router: Router
  ) {}

  /* Create a project. */
  createProject(title: string): void {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    const newProject = {
      title: title
    };
    this.http
      .post<{ message: string; project: project }>(this.ROOT_URL, newProject)
      .subscribe(
        res => {
          this.projectList.push(res.project);
          this.loading = false;
          this.loadingSubject.next(this.loading);
          this.router.navigate(['/', 'projects']);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
          this.loading = false;
          this.loadingSubject.next(this.loading);
        }
      );
  }

  //* Get all projects. */
  getProjects(): void {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    this.http
      .get<{ message: string; projects: project[] }>(this.ROOT_URL)
      .subscribe(
        res => {
          this.projectList = res.projects;
          this.projectListSubject.next(this.projectList);
          this.loading = false;
          this.loadingSubject.next(this.loading);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
          this.loading = false;
          this.loadingSubject.next(this.loading);
        }
      );
  }

  /* Update a project. */
  updateProject(title: string, projectId: string): void {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    const updatedProject = {
      title: title
    };
    this.http
      .put<{ message: string; updatedProject: project }>(
        this.ROOT_URL + `/${projectId}`,
        updatedProject
      )
      .subscribe(
        res => {
          const index = this.projectList.findIndex(
            project => project.id === projectId
          );
          this.projectList[index] = res.updatedProject;
          this.loading = false;
          this.loadingSubject.next(this.loading);
          this.router.navigate(['/', 'projects']);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
          this.loading = false;
          this.loadingSubject.next(this.loading);
        }
      );
  }

  /* Delete a project. */
  deleteProject(projectId: string): void {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    this.http.delete(this.ROOT_URL + `/${projectId}`).subscribe(
      res => {
        console.log(res);
        this.projectList = this.projectList.filter(
          project => project.id !== projectId
        );
        this.projectListSubject.next(this.projectList);
        this.taskService.getTaskListSubject().next([]);
        this.loading = false;
        this.loadingSubject.next(this.loading);
      },
      err => {
        this.error = err.error.message;
        this.errorSubject.next(this.error);
        this.loading = false;
        this.loadingSubject.next(this.loading);
      }
    );
  }

  /* Return projectListSubject as an observable. */
  getProjectListAsObs(): Observable<project[]> {
    return this.projectListSubject.asObservable();
  }

  /* Return loadingSubject as an observable. */
  getLoadingAsObs(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
