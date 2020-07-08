// Libraries.
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Services.
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {}

  /* Create a new project. */
  createProject(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid) {
      return;
    }
    this.projectService.createProject(form.value.title);
  }
}
