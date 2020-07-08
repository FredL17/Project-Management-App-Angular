// Libraries.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Services.
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  projectId: string = '';
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('projectId');
    });
  }

  createTask(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid || this.projectId === '') {
      return;
    }
    this.taskService.createTask(this.projectId, form.value.title);
  }
}
