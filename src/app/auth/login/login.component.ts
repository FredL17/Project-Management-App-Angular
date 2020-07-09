import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
// Services.
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Local variables.
  error: string = '';
  loading: boolean = false;
  // Subscriptions.
  errorSubs: Subscription;
  loadingSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.errorSubs = this.authService.getErrorAsObs().subscribe(res => {
      this.error = res;
    });
    this.loadingSubs = this.authService.getLoadingAsObs().subscribe(res => {
      this.loading = res;
    });
  }

  ngOnDestroy(): void {
    this.errorSubs.unsubscribe();
    this.loadingSubs.unsubscribe();
  }

  onLogin(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid) {
      return;
    }
    this.authService.loginUser(form.value.email, form.value.password);
  }

  /* Login as a demo user (auto login unavailable in this mode). */
  onDemoUserLogin(): void {
    this.authService.loginDemoUser();
  }
}
