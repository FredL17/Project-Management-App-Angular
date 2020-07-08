import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// Services.
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authStatusSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(res => {
        this.userIsAuthenticated = res;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

  onLogout(): void {
    this.authService.logoutUser();
  }
}
