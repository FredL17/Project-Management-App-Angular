import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
