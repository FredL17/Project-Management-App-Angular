// Libraries.
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// Models.
import { task } from 'src/app/models/task.model';
// Services.
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  // Fontawsome favicons.
  trash: any = faTrashAlt;
  edit: any = faEdit;
  // Local variables.
  taskList: task[] = [];
  loading: boolean = false;
  @Input() currentViewedProjectId: string = '';
  // Subscriptions.
  taskListSubs: Subscription;
  loadingTasksSubs: Subscription;

  constructor(private taskService: TaskService, private router: Router) {
    this.taskListSubs = this.taskService.getTaskListAsObs().subscribe(res => {
      this.taskList = res;
    });
    this.loadingTasksSubs = this.taskService
      .getLoadingAsObs()
      .subscribe(res => {
        this.loading = res;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.taskListSubs.unsubscribe();
    this.loadingTasksSubs.unsubscribe();
  }

  /* Navigate to new-task page. */
  onCreateTask(): void {
    this.router.navigate(['projects', this.currentViewedProjectId, 'new-task']);
  }

  /* Navigate to edit-task page. */
  onUpdateTask(taskId: string): void {
    this.router.navigate([
      'projects',
      this.currentViewedProjectId,
      'edit-task',
      taskId
    ]);
  }

  /* Delete a task. */
  onDeleteTask(taskId: string): void {
    this.taskService.deleteTask(this.currentViewedProjectId, taskId);
  }

  /* Change a task's completion state. */
  onChangeTaskState(taskId: string, completed: boolean): void {
    this.taskService.changeTaskState(
      this.currentViewedProjectId,
      taskId,
      completed
    );
  }
}
