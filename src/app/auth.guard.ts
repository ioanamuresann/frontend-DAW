import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    return this.checkLogin();
  }

  private checkLogin(): boolean {
    if (this.userService.getLoggedUser()) {
      return true;
    } else {
      alert('Trebuie sa fi logat!');
      this.router.navigate(['/']);
      return false;
    }
  }
}
