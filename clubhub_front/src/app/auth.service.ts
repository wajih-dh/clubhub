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
    .pipe(tap((response: { token: string, role: string, user_id: number, name: string, email: string }) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('user_id', response.user_id.toString());
      localStorage.setItem('name', response.name);     // ✅ add name
      localStorage.setItem('email', response.email);   // ✅ add email
    }));
}

getCurrentUserInfo(): { id: number, name: string, email: string } | null {
  const id = localStorage.getItem('user_id');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  if (id && name && email) {
    return { id: parseInt(id, 10), name, email };
  }
  return null;
}
getCurrentUserId(): number | null {
  const id = localStorage.getItem('user_id');
  return id ? parseInt(id, 10) : null;
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
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user_id');
  localStorage.removeItem('name');
  localStorage.removeItem('email');

  sessionStorage.clear(); // optional if you also use sessionStorage elsewhere
  this.router.navigate(['/signin']);
}

  }

