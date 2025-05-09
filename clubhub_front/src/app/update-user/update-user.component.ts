import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  standalone: true,
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  imports: [CommonModule, FormsModule]
})
export class UpdateUserComponent implements OnInit {
  userId: number = 0;
  username: string = '';
  email: string = '';
  role: string = 'User'; // Default role as 'User'

  roles: string[] = ['Admin','Organisator','Student'] ;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,  // To fetch params from the URL
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch userId from the route parameters
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    console.log('User ID from route:', this.userId); // Log the user ID
  
    if (isNaN(this.userId) || this.userId <= 0) {
      console.error('Invalid user ID');
      return;
    }
  
    // Fetch user details to populate the form
    this.userService.getUserById(this.userId).subscribe(
      (user) => {
        console.log('User fetched:', user); // Log fetched user data
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
      },
      (error) => {
        console.error('Error fetching user:', error);
        alert('Failed to fetch user details. Please try again.');
      }
    );
  }
  
  onSubmit() {
    this.userService.updateUser(this.userId, this.username, this.email, this.role).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.router.navigate(['/admin']); // Navigate back to admin page
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
}
