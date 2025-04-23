import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { EventComponent } from './event/event.component';
import { AuthGuard } from './auth.guard'; // use your actual path

export const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'event',
    component: EventComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Student'] }
  },
  { path: '', redirectTo: 'signin', pathMatch: 'full' }
];
