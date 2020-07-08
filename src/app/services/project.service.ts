import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { project } from '../models/project.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly ROOT_URL: string = 'http://localhost:3000';
  projectListSubject: Subject<project[]> = new Subject();
  taskListSubject: Subject<task[]> = new Subject();
  projectList: project[] = [];
  taskList: task[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  /* Create a project. */
  createProject(title: string): void {
    const newProject = {
      title: title
    };
    this.http
      .post<{ message: string; project: project }>(
        this.ROOT_URL + '/projects',
        newProject
      )
      .subscribe(res => {
        this.projectList.unshift(res.project);
        this.router.navigate(['/', 'projects']);
      });
  }

  //* Get all projects. */
  getProjects(): void {
    this.http.get<project[]>(this.ROOT_URL + '/projects').subscribe(res => {
      this.projectList = res;
      this.projectListSubject.next(this.projectList);
    });
  }

  /* Update a project. */
  updateProject(title: string, projectId: string): void {
    const updatedProject = {
      title: title
    };
    this.http
      .put<{ message: string; updatedProject: project }>(
        this.ROOT_URL + `/projects/${projectId}`,
        updatedProject
      )
      .subscribe(res => {
        console.log(res);
        const index = this.projectList.findIndex(
          project => project.id === projectId
        );
        this.projectList[index] = {
          ...this.projectList[index],
          title: title
        };
        this.router.navigate(['/', 'projects']);
      });
  }

  /* Delete a project. */
  deleteProject(projectId: string): void {
    this.http
      .delete(this.ROOT_URL + `/projects/${projectId}`)
      .subscribe(res => {
        console.log(res);
        this.projectList = this.projectList.filter(
          project => project.id !== projectId
        );
        this.projectListSubject.next(this.projectList);
      });
  }

  getProjectListAsObs(): Observable<project[]> {
    return this.projectListSubject.asObservable();
  }

  createTask(projectId: string, title: string): void {
    const newTask = {
      title: title
    };
    this.http
      .post(this.ROOT_URL + `/projects/${projectId}/tasks`, newTask)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['projects']);
      });
  }

  /* Get all tasks of a project. */
  getTasks(projectId: string): void {
    this.http
      .get<{ message: string; taskList: task[] }>(
        this.ROOT_URL + `/projects/${projectId}/tasks`
      )
      .subscribe(res => {
        console.log(res.taskList);
        this.taskList = res.taskList;
        this.taskListSubject.next(this.taskList);
      });
  }

  updateTask(projectId: string, taskId: string, title: string): void {
    const updatedTask = {
      title: title
    };
    this.http
      .put(
        this.ROOT_URL + `/projects/${projectId}/tasks/${taskId}`,
        updatedTask
      )
      .subscribe(res => {
        console.log(res);
        const index = this.taskList.findIndex(task => task.id === taskId);
        this.taskList[index] = {
          ...this.taskList[index],
          title: title
        };
        this.router.navigate(['projects']);
      });
  }

  deleteTask(projectId: string, taskId: string): void {
    this.http
      .delete(this.ROOT_URL + `/projects/${projectId}/tasks/${taskId}`)
      .subscribe(res => {
        this.taskList = this.taskList.filter(task => task.id !== taskId);
        this.taskListSubject.next(this.taskList);
      });
  }

  changeTaskState(projectId: string, taskId: string, completed: boolean): void {
    const updatedTaskState = {
      completed: completed
    };
    this.http
      .put(
        this.ROOT_URL + `/projects/${projectId}/tasks/${taskId}`,
        updatedTaskState
      )
      .subscribe(res => {
        console.log(res);
        const index = this.taskList.findIndex(task => task.id === taskId);
        this.taskList[index] = {
          ...this.taskList[index],
          completed: completed
        };
        this.router.navigate(['projects']);
      });
  }

  getTaskListAsObs(): Observable<task[]> {
    return this.taskListSubject.asObservable();
  }
}
