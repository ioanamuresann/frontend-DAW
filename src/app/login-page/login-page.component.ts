import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  email: string = '';
  parola: string = '';

  constructor(private router: Router, private userService: UserService) {}

  login(): void {
    const credentials = { email: this.email, parola: this.parola };
    console.log(credentials);
    this.userService.login(credentials).subscribe(
      (response) => {
        if (response && response.user) {
          this.router.navigate(['pack&go/acasa']);
        } else {
          console.error('Răspuns invalid de la server:', response);
          alert('Eroare la autentificare! Verifică datele introduse.');
        }
      },
      (error) => {
        console.error('Eroare la autentificare:', error);
        alert('Eroare la autentificare! Verifică datele introduse.');
      }
    );
  }

  register(): void {
    this.router.navigate(['register']);
  }
}
