import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FullCalendarModule } from "@fullcalendar/angular"
import dayGridPlugin from "@fullcalendar/daygrid"
import { EventService } from "../event.service"
import { HttpClientModule } from "@angular/common/http"
import { AuthService } from "../auth.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-event",
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HttpClientModule],
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"],
})
export class EventComponent implements OnInit {
  // Define color classes for random assignment
  private colorClasses = [
    "event-color-1", // Red-Orange
    "event-color-2", // Blue
    "event-color-3", // Purple
    "event-color-4", // Green
    "event-color-5", // Pink-Purple
    "event-color-6", // Teal
    "event-color-7", // Orange
  ]

  calendarOptions: any = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin],
    events: [],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek",
    },
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
  }

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // ⬇️ Only get accepted events
    this.eventService.getAcceptedEvents().subscribe({
      next: (data) => {
        const formattedEvents = data.map((event) => ({
          title: event.title,
          date: event.date,
          extendedProps: {
            time: event.time,
            location: event.location,
            description: event.description,
            event_id: event.event_id,
            // Assign a random color class to each event
            colorClass: this.getRandomColorClass(),
          },
        }))

        this.calendarOptions = {
          ...this.calendarOptions,
          events: formattedEvents,
        }
      },
      error: (err) => {
        console.error("❌ Error fetching accepted events:", err)
      },
    })
  }

  // Get a random color class from our array
  private getRandomColorClass(): string {
    const randomIndex = Math.floor(Math.random() * this.colorClasses.length)
    return this.colorClasses[randomIndex]
  }

  // Apply the color class to the event element when it's mounted
  handleEventDidMount(info: any) {
    const colorClass = info.event.extendedProps.colorClass
    if (colorClass) {
      info.el.classList.add(colorClass)
    }
  }

  handleEventClick(info: any) {
    const { title, extendedProps, start } = info.event

    const selectedEvent = {
      title,
      date: start.toISOString().split("T")[0],
      time: extendedProps.time,
      location: extendedProps.location,
      description: extendedProps.description,
      event_id: extendedProps.event_id,
    }

    console.log("🟢 Selected event:", selectedEvent)
    this.router.navigate(["/event-details"], { state: { event: selectedEvent } })
  }

  logOut(): void {
    this.authService.logOut()
  }
}
