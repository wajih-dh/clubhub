import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { 
  Chart, 
  ChartConfiguration, 
  ChartData, 
  ChartType,
  registerables 
} from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-pending-events',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './pending-events.component.html',
  styleUrls: ['./pending-events.component.css']
})
export class PendingEventsComponent implements OnInit, AfterViewInit {
  @ViewChild('eventChart') chartCanvas!: ElementRef;
  chart: Chart | null = null;

  pendingEvents: any[] = [];
  acceptedEvents: any[] = [];
  refusedEvents: any[] = [];
  
  // Statistics
  totalEvents: number = 0;
  pendingPercentage: number = 0;
  acceptedPercentage: number = 0;
  refusedPercentage: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPendingEvents();
    this.getAcceptedEvents();
    this.getRefusedEvents();
  }

  ngAfterViewInit(): void {
    // We'll initialize the chart after data is loaded
  }

  initChart(): void {
    if (this.chartCanvas && this.chartCanvas.nativeElement) {
      // Destroy previous chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      
      // Define chart type
      const type: ChartType = 'doughnut';
      
      // Define chart data
      const data: ChartData = {
        labels: ['Pending', 'Accepted', 'Refused'],
        datasets: [{
          data: [
            this.pendingEvents.length,
            this.acceptedEvents.length,
            this.refusedEvents.length
          ],
          backgroundColor: [
            'rgba(246, 211, 101, 1)',
            'rgba(67, 206, 162, 1)',
            'rgba(255, 94, 98, 1)'
          ],
          borderWidth: 0
        }]
      };
      
      // Create chart configuration
      const config = {
        type: type,
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          // For doughnut charts, we need to use this approach for cutout
          radius: '90%',
          cutout: '70%'
        }
      };

      this.chart = new Chart(ctx, config as any);
    }
  }

  getPendingEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/events/pending')
      .subscribe({
        next: (data) => {
          this.pendingEvents = data;
          this.calculateStatistics();
          this.initChart(); // Update chart after data is loaded
        },
        error: (error) => console.error('Error fetching pending events', error)
      });
  }
  
  getAcceptedEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/events/accepted')
      .subscribe({
        next: (data) => {
          this.acceptedEvents = data;
          this.calculateStatistics();
          this.initChart(); // Update chart after data is loaded
        },
        error: (error) => console.error('Error fetching accepted events', error)
      });
  }
  
  getRefusedEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/events/refused')
      .subscribe({
        next: (data) => {
          this.refusedEvents = data;
          this.calculateStatistics();
          this.initChart(); // Update chart after data is loaded
        },
        error: (error) => console.error('Error fetching refused events', error)
      });
  }

  calculateStatistics(): void {
    this.totalEvents = this.pendingEvents.length + this.acceptedEvents.length + this.refusedEvents.length;
    
    if (this.totalEvents > 0) {
      this.pendingPercentage = Math.round((this.pendingEvents.length / this.totalEvents) * 100);
      this.acceptedPercentage = Math.round((this.acceptedEvents.length / this.totalEvents) * 100);
      this.refusedPercentage = Math.round((this.refusedEvents.length / this.totalEvents) * 100);
    } else {
      this.pendingPercentage = 0;
      this.acceptedPercentage = 0;
      this.refusedPercentage = 0;
    }
  }

  updateStatus(eventId: number, status: string): void {
    this.http.put(`http://localhost:5000/api/events/${eventId}/status`, { status })
      .subscribe({
        next: () => {
          // Refresh all event lists
          this.getPendingEvents();
          this.getAcceptedEvents();
          this.getRefusedEvents();
        },
        error: (error) => console.error('Error updating status', error)
      });
  }
}