import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  user = {
    nume: '',
    prenume: '',
    email: '',
    parola: '',
    rol: 'client',
  };
  @ViewChild('numeInput') numeInput: any;
  @ViewChild('prenumeInput') prenumeInput: any;
  @ViewChild('emailInput') emailInput: any;
  showPassword = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.register(this.user).subscribe(
      (response) => {
        console.log('Înregistrare cu succes!', response);
        alert('Înregistrarea cu succes!');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Eroare la înregistrare:', error);
        alert('Eroare la înregistrare');
      }
    );
  }
}
