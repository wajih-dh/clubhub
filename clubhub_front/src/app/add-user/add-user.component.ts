import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-user',
  standalone:true,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  imports: [CommonModule,FormsModule,]
})
export class AddUserComponent {
  username = '';
  email = '';
  password = '';

constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    this.authService.signUp(this.username, this.email, this.password).subscribe(response => {
      console.log('User signed up successfully:', response);
      this.router.navigate(['/admin']);
    }, error => {
      console.error('Error signing up:', error);

    });
  }
}

