import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Subscription } from 'rxjs';
import { project } from '../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectList: project[];
  projectListSub: Subscription;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectListSub = this.projectService
      .getProjectListAsObs()
      .subscribe(res => {
        this.projectList = res;
      });
    this.projectService.getProjects();
  }

  onCreateProject(): void {
    this.projectService.createProject('Good Project');
  }
}
