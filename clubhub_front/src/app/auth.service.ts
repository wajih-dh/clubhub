import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient,private router:Router) {}

  signIn(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, credentials)
      .pipe(tap((response: { token: string, role: string }) => {
       
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
       }));
  }

  signUp(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, email, password });
  }

  get currentUserRole(): string | null {
    return localStorage.getItem('role');
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logOut(): void {
    
    localStorage.removeItem('role');
    localStorage.removeItem('authToken'); 
    sessionStorage.clear();


    this.router.navigate(['/signin']);
  }
  }

