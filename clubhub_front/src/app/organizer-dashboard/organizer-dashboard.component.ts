import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css']
})
export class OrganizerDashboardComponent implements OnInit {
  newEvent = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    user_id: 0
  };

  submittedEvent: any = null;
  acceptedEvents: any[] = [];

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.newEvent.user_id = userId;
      this.fetchAcceptedEvents(userId); // ✅ Fetch all accepted events by the organizer
    } else {
      console.error('User ID not found!');
    }
  }

  submitEvent(): void {
    this.eventService.addEvent(this.newEvent).subscribe({
      next: (data) => {
        this.submittedEvent = data;
        this.fetchAcceptedEvents(this.newEvent.user_id); // Refresh list
        this.newEvent = { title: '', description: '', date: '', time: '', location: '', user_id: this.newEvent.user_id };
      },
      error: (err) => console.error('❌ Failed to submit event:', err)
    });
  }

  fetchAcceptedEvents(userId: number): void {
    this.eventService.getAcceptedEventsByUserId(userId).subscribe({
      next: (events) => {
        this.acceptedEvents = events;
      },
      error: (err) => console.error('❌ Failed to fetch accepted events:', err)
    });
  }
  logOut(): void {
  this.authService.logOut();
}
}
