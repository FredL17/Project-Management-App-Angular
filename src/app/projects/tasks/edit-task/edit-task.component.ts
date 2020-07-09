// Libraries.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
// Services.
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {
  // Local variables.
  projectId: string = '';
  taskId: string = '';
  loading: boolean = false;
  // Subscriptions.
  loadingSubs: Subscription;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('projectId');
      this.taskId = params.get('taskId');
    });
    this.loadingSubs = this.taskService.getLoadingAsObs().subscribe(res => {
      this.loading = res;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  updateTask(form: NgForm): void {
    if (form.invalid || this.projectId === '' || this.taskId === '') {
      return;
    }
    this.taskService.updateTask(this.projectId, this.taskId, form.value.title);
  }
}
