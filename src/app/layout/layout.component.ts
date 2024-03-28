import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,NgbModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private scroller: ViewportScroller,
    private router: Router,
    private userService: UserService) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  goDown(arg: string) {
    this.scroller.scrollToAnchor(arg);
  }

  isUserAdmin(): boolean {
    const user = this.userService.getLoggedUser();
    return user && user.rol === 'admin';
  }
}
