import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  projectId: string = '';
  taskId: string = '';

  constructor(
    private projectService: ProjectService,
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
    this.projectService.updateTask(
      this.projectId,
      this.taskId,
      form.value.title
    );
  }
}
