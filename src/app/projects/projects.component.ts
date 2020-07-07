import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Subscription } from 'rxjs';
import { project } from '../models/project.model';
import { Router } from '@angular/router';

import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { task } from '../models/task.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  trash: any = faTrashAlt;
  edit: any = faEdit;
  projectList: project[] = [];
  taskList: task[] = [];
  selectedProjectId: string = '';
  projectListSub: Subscription;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.projectListSub = this.projectService
      .getProjectListAsObs()
      .subscribe(res => {
        this.projectList = res;
      });
    this.projectService.getProjects();
  }

  onCreateProject(): void {
    this.router.navigate(['/', 'new-project']);
  }
  onUpdateProject(projectId: string): void {
    console.log(projectId);
    this.router.navigate(['/', 'edit-project', projectId]);
  }

  onDeleteProject(projectId: string): void {
    this.projectService.deleteProject(projectId);
  }

  getTasks(projectId: string): void {
    this.selectedProjectId = projectId;
    this.projectService.getTasks(projectId);
  }
}
