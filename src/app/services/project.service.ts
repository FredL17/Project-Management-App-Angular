import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { project } from '../models/project.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly ROOT_URL: string = 'http://localhost:3000';
  projectListSubject: Subject<project[]> = new Subject();
  projectList: project[] = [];
  constructor(private http: HttpClient) {}

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
      });
  }

  getProjects(): void {
    this.http.get<project[]>(this.ROOT_URL + '/projects').subscribe(res => {
      this.projectList = res;
      this.projectListSubject.next(this.projectList);
    });
  }

  getProjectListAsObs(): Observable<project[]> {
    return this.projectListSubject.asObservable();
  }
}
