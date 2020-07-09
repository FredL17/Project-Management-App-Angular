// Libraries.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
// Services.
import { ProjectService } from 'src/app/services/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit, OnDestroy {
  // Local variables.
  loading: boolean = false;
  // Subscriptions.
  loadingSubs: Subscription;

  constructor(private projectService: ProjectService) {
    this.loadingSubs = this.projectService.getLoadingAsObs().subscribe(res => {
      this.loading = res;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  /* Create a new project. */
  createProject(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid) {
      return;
    }
    this.projectService.createProject(form.value.title);
  }
}
