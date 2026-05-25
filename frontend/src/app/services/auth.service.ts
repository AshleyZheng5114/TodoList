import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'authToken';
  private userKey = 'user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUserObs = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticatedObs = this.isAuthenticatedSubject.asObservable();

  private http = inject(HttpClient);

  constructor() {
    this.loadUserFromStorage();
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  loginWithGithub() {
    window.location.href = 'http://localhost:3000/auth/github';
  }

  handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');

    if (token) {
      this.setToken(token);

      this.getCurrentUser().subscribe({
        next: (user: User) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);

          window.history.replaceState({}, document.title, '/');
        },
        error: (error: Error) => {
          console.error('Failed to fetch user info:', error);
        },
      });
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.getCurrentUser().subscribe({
        next: (user: User) => {
          this.currentUserSubject.next(user);
        },
        error: (error: Error) => {
          console.error('Failed to fetch user info:', error);
          this.logout();
        },
      });
    }
  }
}
