import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutComponent } from "../layout/layout.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [LayoutComponent, CommonModule]
})
export class HomeComponent implements OnInit{

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('loggedUser'));
  }
}
