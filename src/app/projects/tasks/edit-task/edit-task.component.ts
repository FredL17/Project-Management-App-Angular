// Libraries.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Services.
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  projectId: string = '';
  taskId: string = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('projectId');
      this.taskId = params.get('taskId');
    });
  }

  updateTask(form: NgForm): void {
    if (form.invalid || this.projectId === '' || this.taskId === '') {
      return;
    }
    this.taskService.updateTask(this.projectId, this.taskId, form.value.title);
  }
}
