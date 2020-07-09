// Libraries.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
// Services.
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit, OnDestroy {
  // Local variables.
  loading: boolean = false;
  private projectId: string = '';
  // Subscriptions.
  loadingSubs: Subscription;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.projectId = paramMap.get('id');
    });
    this.loadingSubs = this.projectService.getLoadingAsObs().subscribe(res => {
      this.loading = res;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
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
