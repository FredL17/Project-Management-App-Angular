import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  projectId: string = '';
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params.get('projectId'));
      this.projectId = params.get('projectId');
    });
  }

  createTask(form: NgForm): void {
    if (form.invalid || this.projectId === '') {
      return;
    }
    this.projectService.createTask(this.projectId, form.value.title);
  }
}
