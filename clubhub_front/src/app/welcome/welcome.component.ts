import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

@Component({
  selector: "app-welcome",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigateToSignIn(): void {
    this.router.navigate(["/signin"])
  }
}
