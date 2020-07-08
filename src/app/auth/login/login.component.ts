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
  error: string = '';
  errorSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.errorSub = this.authService.getErrorAsObs().subscribe(res => {
      this.error = res;
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onLogin(form: NgForm): void {
    // Do nothing if the form is invalid.
    if (form.invalid) {
      return;
    }
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
