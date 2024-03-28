import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  user: any;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'http://localhost:5000';
  loggedUser: any;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response) => {
          if (response && response.user) {
            this.setLoggedUser(response.user);
          }
          return response;
        })
      );
  }

  setLoggedUser(loggedUser: any): void {
    this.loggedUser = loggedUser;
    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
  }

  getLoggedUser(): any {
    const userDataString = sessionStorage.getItem('loggedUser');
    return userDataString ? JSON.parse(userDataString) : null;
  }
}
