// Libraries.
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// Models.
import { project } from '../models/project.model';
// Services.
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  // Fontawsome favicons.
  trash: any = faTrashAlt;
  edit: any = faEdit;
  // Local variables.
  projectList: project[] = [];
  selectedProjectId: string = '';
  loading: boolean = true;
  // Subscriptions.
  projectListSubs: Subscription;
  loadingProjectsSubs: Subscription;

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
    this.loadingProjectsSubs = this.projectService
      .getLoadingAsObs()
      .subscribe(res => {
        this.loading = res;
      });
  }

  ngOnInit(): void {
    this.projectService.getProjects();
  }

  ngOnDestroy(): void {
    this.projectListSubs.unsubscribe();
    this.loadingProjectsSubs.unsubscribe();
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
    this.selectedProjectId = '';
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
