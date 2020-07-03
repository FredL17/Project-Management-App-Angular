import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { authData } from '../models/auth-data.model';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private authStatus = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  readonly ROOT_URL: string = 'http://localhost:3000';
  constructor(private http: HttpClient, private router: Router) {}

  /* Sing up new user. */
  createUser(email: string, password: string): void {
    const authData: authData = {
      email: email,
      password: password
    };
    this.http.post(this.ROOT_URL + '/signup', authData).subscribe(res => {
      console.log(res);
      this.router.navigate(['/', 'login']);
    });
  }

  /* Login user. */
  loginUser(email: string, password: string) {
    const authData: authData = { email: email, password: password };
    this.http
      .post<{ token: string; expiredIn: number }>(
        this.ROOT_URL + '/login',
        authData
      )
      .subscribe(res => {
        this.token = res.token;
        if (this.token) {
          const duration = res.expiredIn;
          this.setTokenTimer(duration);
          this.authStatus = true;
          this.authStatusListener.next(this.authStatus);
          const expirationDate = new Date(
            new Date().getTime() + duration * 1000
          );
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(['/projects']);
        }
      });
  }

  autoAuthUser(): void {
    const authData = this.getAuthData();
    console.log(authData);
    if (!authData) {
      return;
    }
    const now = new Date();
    const expiredIn = authData.expirationDate.getTime() - now.getTime();
    if (expiredIn > 0) {
      this.token = authData.token;
      this.authStatus = true;
      this.setTokenTimer(expiredIn / 1000);
      this.authStatusListener.next(this.authStatus);
    }
  }

  /* Logout user. */
  logoutUser(): void {
    this.token = null;
    this.authStatus = false;
    this.authStatusListener.next(this.authStatus);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/', 'login']);
  }

  /* Get current web token. */
  getToken(): string {
    return this.token;
  }

  getAuthStatus(): boolean {
    return this.authStatus;
  }

  /* Return authStatus as observable. */
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private setTokenTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    console.log(token);
    const expirationDate = localStorage.getItem('expirationDate');
    console.log(expirationDate);
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
