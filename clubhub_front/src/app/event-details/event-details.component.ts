import { Component } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { AuthService } from "../auth.service"
import { HttpClient } from "@angular/common/http"
import { EmailService } from "../email.service"

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
    private emailService: EmailService,
  ) {
    const eventData = history.state.event
    if (eventData) {
      this.event = eventData
      console.log("📝 Event with description:", this.event)
    }
  }

  register(): void {
    const user = this.authService.getCurrentUserInfo()
    console.log("👤 User from AuthService:", user)
    console.log("📅 Event:", this.event)

    if (user && this.event && this.event.event_id) {
      const payload = {
        event_id: this.event.event_id,
        name: user.name,
        email: user.email,
      }
      console.log("🟢 Payload to send:", payload)

      this.http.post("http://localhost:5000/api/participant", payload).subscribe({
        next: () => {
          this.successMessage = "✅ You have successfully registered!"

          // Send confirmation email without changing the UI
          this.sendConfirmationEmail(user.email, user.name)
        },
        error: (err) => {
          console.error("❌ Error registering participant:", err)
          this.successMessage = "❌ Registration failed!"
        },
      })
    } else {
      console.warn("🔴 Missing user or event data")
    }
  }

  // Send confirmation email without affecting the UI
  private sendConfirmationEmail(userEmail: string, userName: string): void {
    this.emailService.sendEventRegistrationEmail(userEmail, userName, this.event).subscribe({
      next: () => {
        console.log("📧 Confirmation email sent successfully to", userEmail)
      },
      error: (err) => {
        console.error("❌ Error sending confirmation email:", err)
        // Don't show any error to the user since we don't want to change the UI
      },
    })
  }

  goBack(): void {
    this.router.navigate(["/event"])
  }
}
