import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  getAcceptedEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accepted`);
  }

  getRefusedEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/refused`);
  }

  addEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, eventData);
  }

  updateEvent(eventId: number, eventData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${eventId}`, eventData);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventId}`);
  }
  getAcceptedEventsByUserId(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/accepted/organizer/${userId}`);
}

}
