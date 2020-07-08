// Libraries.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Services.
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  private projectId: string = '';
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.projectId = paramMap.get('id');
    });
  }

  /* Update a project. */
  updateProject(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid) {
      return;
    }
    this.projectService.updateProject(form.value.title, this.projectId);
  }
}
