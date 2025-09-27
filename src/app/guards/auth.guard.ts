import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenKey = 'auth_token';
  const authToken = localStorage.getItem(tokenKey);
  const router = inject(Router);

  if (authToken == null) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

