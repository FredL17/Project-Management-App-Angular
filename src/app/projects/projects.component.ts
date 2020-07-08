// Libraries.
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// Models.
import { project } from '../models/project.model';
import { task } from '../models/task.model';
// Services.
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  // Fontawsome favicons.
  trash: any = faTrashAlt;
  edit: any = faEdit;
  // Local variables.
  projectList: project[] = [];
  taskList: task[] = [];
  selectedProjectId: string = '';
  // Observable subscriptions.
  projectListSubs: Subscription;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private router: Router
  ) {
    this.projectListSubs = this.projectService
      .getProjectListAsObs()
      .subscribe(res => {
        this.projectList = res;
      });
  }

  ngOnInit(): void {
    this.projectService.getProjects();
  }

  /* Navigate to new-project page. */
  onCreateProject(): void {
    this.router.navigate(['/', 'new-project']);
  }

  /* Navigate to edit-project page. */
  onUpdateProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.router.navigate(['/', 'edit-project', projectId]);
  }

  /* Delete a project. */
  onDeleteProject(projectId: string): void {
    if (this.selectedProjectId === projectId) {
      this.selectedProjectId = '';
      this.taskList = [];
    }
    this.projectService.deleteProject(projectId);
  }

  /* Get tasks for the project that is being clicked. */
  getTasks(projectId: string): void {
    if (projectId === this.selectedProjectId) {
      return;
    }
    this.selectedProjectId = projectId;
    this.taskService.getTasks(projectId);
  }
}
