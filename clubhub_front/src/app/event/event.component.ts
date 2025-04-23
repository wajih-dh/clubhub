import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from '../event.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HttpClientModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        const formattedEvents = data.map(event => ({
          title: event.title,
          date: event.date,
          extendedProps: {
            time: event.time,
            location: event.location
          }
        }));
        this.calendarOptions = {
          ...this.calendarOptions,
          events: formattedEvents
        };
      },
      error: (err) => {
        console.error('❌ Error fetching events:', err);
      }
    });
  }

  handleEventClick(info: any) {
    const { title, extendedProps } = info.event;
    const message = `🗓 ${title}\n🕒 Time: ${extendedProps.time || 'N/A'}\n📍 Location: ${extendedProps.location || 'N/A'}`;
    alert(message);
  }
}
