import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Travel';

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: Event) {
    sessionStorage.removeItem('loggedUser');
  }
}
