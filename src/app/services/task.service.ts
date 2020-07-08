import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
// Models.
import { task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Subjects for cross-component communication.
  taskListSubject: Subject<task[]> = new Subject();
  errorSubject: Subject<string> = new Subject();
  // Local variables.
  readonly ROOT_URL: string = 'http://localhost:3000/projects';
  private taskList: task[] = [];
  private error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  /* Create a task for the specified project. */
  createTask(projectId: string, title: string): void {
    const newTask = {
      title: title
    };
    this.http
      .post<{ message: string; task: task }>(
        this.ROOT_URL + `/${projectId}/tasks`,
        newTask
      )
      .subscribe(
        res => {
          console.log(res.message);
          this.taskList.push(res.task);
          this.taskListSubject.next(this.taskList);
          this.router.navigate(['projects']);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
        }
      );
  }

  /* Get all tasks of the specified project. */
  getTasks(projectId: string): void {
    this.http
      .get<{ message: string; tasks: task[] }>(
        this.ROOT_URL + `/${projectId}/tasks`
      )
      .subscribe(
        res => {
          console.log(res.message);
          this.taskList = res.tasks;
          this.taskListSubject.next(this.taskList);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
        }
      );
  }

  /* Update a task for the specified project. */
  updateTask(projectId: string, taskId: string, title: string): void {
    const updatedTask = {
      title: title
    };
    this.http
      .put<{ message: string; updatedTask: task }>(
        this.ROOT_URL + `/${projectId}/tasks/${taskId}`,
        updatedTask
      )
      .subscribe(
        res => {
          console.log(res.message);
          const index = this.taskList.findIndex(task => task.id === taskId);
          this.taskList[index] = res.updatedTask;
          this.router.navigate(['projects']);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
        }
      );
  }

  /* Delete a task for the specified project. */
  deleteTask(projectId: string, taskId: string): void {
    this.http
      .delete<{ message: string; removedTask: task }>(
        this.ROOT_URL + `/${projectId}/tasks/${taskId}`
      )
      .subscribe(
        res => {
          console.log(res.message);
          this.taskList = this.taskList.filter(task => task.id !== taskId);
          this.taskListSubject.next(this.taskList);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
        }
      );
  }

  /* Change a task's completion status. */
  changeTaskState(projectId: string, taskId: string, completed: boolean): void {
    const updatedTaskState = {
      completed: completed
    };
    this.http
      .put<{ message: string }>(
        this.ROOT_URL + `/${projectId}/tasks/${taskId}`,
        updatedTaskState
      )
      .subscribe(
        res => {
          console.log(res.message);
          const index = this.taskList.findIndex(task => task.id === taskId);
          this.taskList[index] = {
            ...this.taskList[index],
            completed: completed
          };
          this.router.navigate(['projects']);
        },
        err => {
          this.error = err.error.message;
          this.errorSubject.next(this.error);
        }
      );
  }

  /* Return taskListSubject as an observable. */
  getTaskListAsObs(): Observable<task[]> {
    return this.taskListSubject.asObservable();
  }
}
