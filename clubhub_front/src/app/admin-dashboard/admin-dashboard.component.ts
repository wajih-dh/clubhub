
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component'; 


import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];


  constructor(private userService: UserService,private authService: AuthService, private router: Router) {} 

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
  onUpdate(userId: number) {
   
    this.router.navigate(['/update-user', userId]);
  }
  
  onDelete(userId: number) {
    
    this.userService.deleteUser(userId).subscribe(
      () => {

        this.ngOnInit();
      },
      (error) => {
        console.error('Error deleting user', error);
      }
    );
  }
  

}
