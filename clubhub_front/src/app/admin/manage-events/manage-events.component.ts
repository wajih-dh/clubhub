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
    newEvent = {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      organisator_id: 1  // Set default organisator_id (later we will make dynamic)
    };
    isEditing = false;
    editingEventId: number | null = null;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      this.getEvents();
    }

    getEvents(): void {
      const token = localStorage.getItem('token'); // or sessionStorage, wherever you stored it
    
      this.http.get<any[]>('http://localhost:5000/api/events')
  .subscribe({
    next: (data) => this.events = data,
    error: (error) => console.error('Error fetching events', error)
  });

    }
    

    createEvent(): void {
      if (!this.newEvent.title || !this.newEvent.date || !this.newEvent.time) {
        alert('Title, Date and Time are required!');
        return;
      }
      this.http.post('http://localhost:5000/api/events', this.newEvent)
        .subscribe(() => {
          this.newEvent = { title: '', description: '', date: '', time: '', location: '', organisator_id: 1 };
          this.getEvents();
        });
    }
    
    updateEvent(): void {
      if (this.editingEventId === null) return;
      this.http.put(`http://localhost:5000/api/events/${this.editingEventId}`, this.newEvent)
        .subscribe(() => {
          this.newEvent = { title: '', description: '', date: '', time: '', location: '', organisator_id: 1 };
          this.isEditing = false;
          this.editingEventId = null;
          this.getEvents();
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
        organisator_id: event.organisator_id
      };
    }

    

    deleteEvent(id: number): void {
      this.http.delete(`http://localhost:5000/api/events/${id}`)
        .subscribe({
          next: () => this.getEvents(),
          error: (error) => console.error('Error deleting event', error)
        });
    }
    

    cancelEdit(): void {
      this.isEditing = false;
      this.editingEventId = null;
      this.newEvent = { title: '', description: '', date: '', time: '', location: '', organisator_id: 1 };
    }
  }
