import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-pending-events',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './pending-events.component.html',
  styleUrls: ['./pending-events.component.css']
})
export class PendingEventsComponent implements OnInit {
  pendingEvents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPendingEvents();
  }

  getPendingEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/events/pending')
      .subscribe({
        next: (data) => this.pendingEvents = data,
        error: (error) => console.error('Error fetching pending events', error)
      });
  }

  updateStatus(eventId: number, status: string): void {
    this.http.put(`http://localhost:5000/api/events/${eventId}/status`, { status })
      .subscribe({
        next: () => this.getPendingEvents(),
        error: (error) => console.error('Error updating status', error)
      });
  }
}
