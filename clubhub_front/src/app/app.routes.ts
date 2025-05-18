import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { EventComponent } from './event/event.component';
import { AuthGuard } from './auth.guard';
import { ManageEventsComponent } from './admin/manage-events/manage-events.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { PendingEventsComponent } from './pending-events/pending-events.component';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { EventDetailsComponent } from './event-details/event-details.component'; // 👈 Add this import
import { WelcomeComponent } from './welcome/welcome.component';
export const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/events', component: ManageEventsComponent },
  {
    path: 'event',
    component: EventComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Student'] }
  },
   {
    path: 'event-details',
    component: EventDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student'] }
  },
  {
    path: 'organizer-dashboard',
    component: OrganizerDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'Organisator'}
  },
  {
    path: 'pending-events',
    component: PendingEventsComponent,
    canActivate: [AuthGuard],
    data: { roles: 'Admin' }
  },
  { 
    path: 'add-user', 
    component: AddUserComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'Admin' }
  },
  { 
    path: 'update-user/:id',
    component: UpdateUserComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'Admin' } 
  },

  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];
