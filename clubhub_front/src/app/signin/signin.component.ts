import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SigninComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.signIn(this.credentials).subscribe(
      (response) => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.redirectUserBasedOnRole(response.role);
      },
      (error) => {
        console.error('Login failed', error);
        alert('Invalid email or password');
      }
    );
  }

  redirectUserBasedOnRole(role: string): void {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'TechnicalUser') {
      this.router.navigate(['/technical-user']);
    } else if (role === 'SalesUser') {
      this.router.navigate(['/sales-user']);
    } else if (role === 'User') {
      this.router.navigate(['/user-dashboard']);
    } else {
      alert('Unknown role. Please contact support.');
    }
  }
}
