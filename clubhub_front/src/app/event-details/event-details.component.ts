import { Component } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import  { AuthService } from "../auth.service"
import { HttpClient } from "@angular/common/http"

@Component({
  selector: "app-event-details",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.css"],
})
export class EventDetailsComponent {
  event: any
  successMessage = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {
    const eventData = history.state.event
    if (eventData) {
      this.event = eventData
      console.log("📝 Event with description:", this.event) // Debug log to verify description
    }
  }

  register(): void {
    const user = this.authService.getCurrentUserInfo()
    console.log("👤 User from AuthService:", user) // debug
    console.log("📅 Event:", this.event)

    if (user && this.event && this.event.event_id) {
      const payload = {
        event_id: this.event.event_id, // ✅ use `id` instead of `event_id`
        name: user.name, // or user.username, based on what you're storing
        email: user.email,
      }
      console.log("🟢 Payload to send:", payload) // Debug: check payload before sending

      this.http.post("http://localhost:5000/api/participant", payload).subscribe({
        next: () => (this.successMessage = "✅ You have successfully registered!"),
        error: (err) => {
          console.error("❌ Error registering participant:", err)
          this.successMessage = "❌ Registration failed!"
        },
      })
    } else {
      console.warn("🔴 Missing user or event data")
    }
  }

  goBack(): void {
    this.router.navigate(["/event"])
  }
}
