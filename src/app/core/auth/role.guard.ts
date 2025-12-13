import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

// RoleGuard: permite acceso si el usuario está logueado y su rol está en route.data['roles']
export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.parseUrl('/auth/login');
  }

  const allowed: string[] = (route.data?.['roles'] as string[]) ?? [];
  if (allowed.length === 0) return true;

  return auth.hasAnyRole(...allowed) ? true : router.parseUrl('/profile');
};
