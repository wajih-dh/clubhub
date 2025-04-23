import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    // No token = not authenticated
    router.navigate(['/signin']);
    return false;
  }

  try {
    // Decode token (simplified)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    // Only allow Admin or Student
    if (role === 'Admin' || role === 'Student') {
      return true;
    } else {
      router.navigate(['/signin']);
      return false;
    }
  } catch (err) {
    console.error('Invalid token', err);
    router.navigate(['/signin']);
    return false;
  }
};
