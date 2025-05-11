import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../../admin-navbar/admin-navbar.component';

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
    user_id: 1
  };

  isEditing = false;
  editingEventId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAcceptedEvents();
    this.getRefusedEvents();
  }

  getAcceptedEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/events/accepted')
      .subscribe({
        next: (data) => this.events = data,
        error: (error) => console.error('Error fetching accepted events', error)
      });
  }

  getRefusedEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/events/refused')
      .subscribe({
        next: (data) => this.refusedEvents = data,
        error: (error) => console.error('Error fetching refused events', error)
      });
  }

  createEvent(): void {
    if (!this.newEvent.title || !this.newEvent.date || !this.newEvent.time) {
      alert('Title, Date and Time are required!');
      return;
    }
    this.http.post('http://localhost:5000/api/events', this.newEvent)
      .subscribe(() => {
        this.resetForm();
        this.getAcceptedEvents();
        this.getRefusedEvents();
      });
  }

  updateEvent(): void {
    if (this.editingEventId === null) return;
    this.http.put(`http://localhost:5000/api/events/${this.editingEventId}`, this.newEvent)
      .subscribe(() => {
        this.resetForm();
        this.getAcceptedEvents();
        this.getRefusedEvents();
      });
  }

  deleteEvent(id: number): void {
    this.http.delete(`http://localhost:5000/api/events/${id}`)
      .subscribe({
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
      user_id: 1
    };
  }
}
