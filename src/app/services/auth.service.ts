import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
// Models.
import { authData } from '../models/auth-data.model';
// Environment variables.
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Local variables.
  private loading: boolean = false;
  private error: string = '';
  private token: string = '';
  private authStatus = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  readonly ROOT_URL: string = environment.apiURL;
  // Subjects.
  private errorSubject: Subject<string> = new Subject();
  private loadingSubject: Subject<boolean> = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  /* Sing up new user. */
  createUser(email: string, password: string): void {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    const authData: authData = {
      email: email,
      password: password
    };
    this.http.post<any>(this.ROOT_URL + '/signup', authData).subscribe(
      res => {
        this.loading = false;
        this.loadingSubject.next(this.loading);
        this.router.navigate(['login']);
      },
      err => {
        this.error = err.error.message;
        this.errorSubject.next(this.error);
        this.loading = false;
        this.loadingSubject.next(this.loading);
      }
    );
  }

  /* Login user. */
  loginUser(email: string, password: string) {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    const authData: authData = { email: email, password: password };
    this.http.post<any>(this.ROOT_URL + '/login', authData).subscribe(
      res => {
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
          this.loading = false;
          this.loadingSubject.next(this.loading);
          this.router.navigate(['projects']);
        }
      },
      err => {
        this.error = err.error.message;
        this.errorSubject.next(this.error);
        this.loading = false;
        this.loadingSubject.next(this.loading);
      }
    );
  }

  /* Login demo user. */
  loginDemoUser(): void {
    this.loading = true;
    this.loadingSubject.next(this.loading);
    this.http.get<any>(this.ROOT_URL + '/demo-login').subscribe(
      res => {
        this.token = res.token;
        if (this.token) {
          this.authStatus = true;
          this.authStatusListener.next(this.authStatus);
          this.loading = false;
          this.loadingSubject.next(this.loading);
          this.router.navigate(['projects']);
        }
      },
      err => {
        this.error = err.error.message;
        this.errorSubject.next(this.error);
        this.loading = false;
        this.loadingSubject.next(this.loading);
      }
    );
  }

  /* Auto login an user. */
  autoAuthUser(): void {
    const authData = this.getAuthData();
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
    this.router.navigate(['login']);
  }

  /* Get current web token. */
  getToken(): string {
    return this.token;
  }

  /* Get authentication status. */
  getAuthStatus(): boolean {
    return this.authStatus;
  }

  /* Return authStatus as observable. */
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  /* Set Token timer: valid for 1 hour. */
  private setTokenTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  /* Save authData to local storage. */
  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  /* Clear authData in local storage. */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  /* Get authData in local storage. */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  /* Return errorSubject as an observable. */
  getErrorAsObs(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  /* Return loadingSubject as an observable. */
  getLoadingAsObs(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
