import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../admin-navbar/admin-navbar.component';
import { EventService } from '../../event.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {
  events: any[] = [];
  refusedEvents: any[] = [];

 newEvent = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  user_id: 0 
};


  isEditing = false;
  editingEventId: number | null = null;

  constructor(private eventService: EventService   ,private authService: AuthService) {}

  ngOnInit(): void {
    this.getAcceptedEvents();
    this.getRefusedEvents();
  }

  getAcceptedEvents(): void {
    this.eventService.getAcceptedEvents().subscribe({
      next: (data) => this.events = data,
      error: (error) => console.error('Error fetching accepted events', error)
    });
  }

  getRefusedEvents(): void {
    this.eventService.getRefusedEvents().subscribe({
      next: (data) => this.refusedEvents = data,
      error: (error) => console.error('Error fetching refused events', error)
    });
  }

  createEvent(): void {
  if (!this.newEvent.title || !this.newEvent.date || !this.newEvent.time) {
    alert('Title, Date and Time are required!');
    return;
  }

  const userId = this.authService.getCurrentUserId(); // 🟢 get user_id from localStorage
  if (userId === null) {
    alert('User not authenticated.');
    return;
  }

  const eventData = {
    ...this.newEvent,
    user_id: userId // 🟢 Assign current user's ID
  };

  this.eventService.addEvent(eventData).subscribe(() => {
    this.resetForm();
    this.getAcceptedEvents();
    this.getRefusedEvents();
  });
}


  updateEvent(): void {
    if (this.editingEventId === null) return;

    this.eventService.updateEvent(this.editingEventId, this.newEvent).subscribe(() => {
      this.resetForm();
      this.getAcceptedEvents();
      this.getRefusedEvents();
    });
  }

  deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.getAcceptedEvents();
        this.getRefusedEvents();
      },
      error: (error) => console.error('Error deleting event', error)
    });
  }

  editEvent(event: any): void {
    this.isEditing = true;
    this.editingEventId = event.event_id;
    this.newEvent = {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      user_id: event.user_id
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
  this.isEditing = false;
  this.editingEventId = null;
  this.newEvent = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    user_id: 0 // Not needed until submit
  };
}

}
