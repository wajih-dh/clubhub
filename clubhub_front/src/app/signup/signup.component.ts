import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone:true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule,FormsModule,]
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';

constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    this.authService.signUp(this.username, this.email, this.password).subscribe(response => {
      console.log('User signed up successfully:', response);
      this.router.navigate(['/signin']);
    }, error => {
      console.error('Error signing up:', error);

    });
  }
}

