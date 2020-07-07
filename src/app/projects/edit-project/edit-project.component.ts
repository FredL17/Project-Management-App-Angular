import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  private projectId: string;
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
      if (paramMap.has('id')) {
        this.projectId = paramMap.get('id');
      } else {
        this.projectId = null;
      }
    });
  }

  updateProject(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.projectService.updateProject(form.value.title, this.projectId);
  }
}
