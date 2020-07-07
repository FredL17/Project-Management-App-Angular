import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { task } from 'src/app/models/task.model';

import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  trash: any = faTrashAlt;
  edit: any = faEdit;
  taskList: task[] = [];
  taskListSub: Subscription;
  @Input() currentViewedProjectId: string = '';

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.taskListSub = this.projectService.getTaskListAsObs().subscribe(res => {
      this.taskList = res;
    });
  }

  ngOnDestroy(): void {
    this.taskListSub.unsubscribe();
  }

  onCreateTask(): void {
    this.router.navigate(['projects', this.currentViewedProjectId, 'new-task']);
  }
  onUpdateTask(taskId: string): void {
    this.router.navigate([
      'projects',
      this.currentViewedProjectId,
      'edit-task',
      taskId
    ]);
  }

  onDeleteTask(taskId: string): void {
    this.projectService.deleteTask(this.currentViewedProjectId, taskId);
  }
}
