// Libraries.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
// Services.
import { TaskService } from 'src/app/services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit, OnDestroy {
  // Local variables.
  projectId: string = '';
  loading: boolean = false;
  // Subscriptions.
  loadingSubs: Subscription;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('projectId');
    });
    this.loadingSubs = this.taskService.getLoadingAsObs().subscribe(res => {
      this.loading = res;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  createTask(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid || this.projectId === '') {
      return;
    }
    this.taskService.createTask(this.projectId, form.value.title);
  }
}
