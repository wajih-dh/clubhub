import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:5000/api/email'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}


  sendEventRegistrationEmail(userEmail: string, userName: string, eventDetails: any): Observable<any> {
    const emailData = {
      to: userEmail,
      userName: userName,
      eventDetails: eventDetails
    };

    return this.http.post(`${this.apiUrl}/send-registration-email`, emailData);
  }
}