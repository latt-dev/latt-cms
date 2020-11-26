import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /** @todo validate token instead of checking presence */
    if (localStorage.getItem('access_token')) {
      return true;
    }

    this.router.navigate(['home']);
    return false;
  }
}
