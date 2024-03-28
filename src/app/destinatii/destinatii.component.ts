import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DestinatiiService } from '../shared/destinatii.service';
import { Destinatie } from '../shared/destinatie.interface';
import { UserService } from '../shared/user.service';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-destinatii',
  standalone: true,
  imports: [CommonModule, NgbDatepickerModule, FormsModule],
  templateUrl: './destinatii.component.html',
  styleUrls: ['./destinatii.component.scss'],
})
export class DestinatiiComponent {
  searchTerm: string = '';
  originalDestinatii!: Destinatie[];
  destinatii!: Destinatie[];
  destinatiiSub10Reducere: Destinatie[] = [];
  destinatiiPeste50Reducere: Destinatie[] = [];
  destinatii30Reducere: Destinatie[] = [];
  loggedUserId: string = '';
  selectedDestination: string = '';

  calendar = inject(NgbCalendar);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 0);
  dataInceput: string = '2024-03-04';
  dataSfarsit: string = '2024-03-14';

  constructor(
    private destinatiiService: DestinatiiService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getDestinations();
    const loggedUser = this.userService.getLoggedUser();
    this.loggedUserId = loggedUser ? loggedUser.id : '';

    this.destinatiiService
      .getNumarRezervariInLuna(
        'afa1aca8-a3ad-4ea4-bea4-6eddf005344c',
        '2024',
        '03'
      )
      .subscribe((data) => console.log(data));
  }

  getDestinations(): void {
    this.destinatiiService.getDestinations().subscribe(
      (data: any[]) => {
        this.destinatii = data;
        this.originalDestinatii = [...this.destinatii];
        this.filterDestinatii();
      },
      (error: any) => {
        console.error('Error fetching destinations:', error);
      }
    );
  }

  filterDestinatii(): void {
    this.destinatiiSub10Reducere = this.destinatii.filter(
      (destinatie) =>
        destinatie.procent_reducere <= 10 && destinatie.procent_reducere != 0
    );
    this.destinatiiPeste50Reducere = this.destinatii.filter(
      (destinatie) => destinatie.procent_reducere >= 50
    );
    this.destinatii30Reducere = this.destinatii.filter(
      (destinatie) => destinatie.procent_reducere === 30
    );
  }

  onDateSelection(date: NgbDate) {
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.dataInceput = `${date.year}-${pad(date.month)}-${pad(date.day)}`;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.dataSfarsit = `${date.year}-${pad(date.month)}-${pad(date.day)}`;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.dataInceput = `${date.year}-${pad(date.month)}-${pad(date.day)}`;
      this.dataSfarsit = '';
    }

    if (this.dataInceput && this.dataSfarsit) {
      console.log(this.dataInceput);
      console.log(this.dataSfarsit);

      const checkAvailabilityObservables = this.originalDestinatii.map(
        (destinatie) =>
          this.checkDestinationAvailability(destinatie.id).pipe(
            map((disponibil) => ({ destinatie, disponibil })),
            catchError(() => of({ destinatie, disponibil: false }))
          )
      );

      forkJoin(checkAvailabilityObservables).subscribe(
        (results: { destinatie: Destinatie; disponibil: boolean }[]) => {
          this.destinatii = results
            .filter((result) => result.disponibil)
            .map((result) => result.destinatie);
        }
      );
    }
  }

  checkDestinationAvailability(destinatieId: string): Observable<boolean> {
    return this.destinatiiService
      .verificaDisponibilitate(destinatieId, this.dataInceput, this.dataSfarsit)
      .pipe(
        map((response: any) => {
          return (
            response.message ===
            'Destinația este disponibilă în intervalul specificat.'
          );
        }),
        catchError((error: any) => {
          console.error('Error checking availability:', error);
          return of(false);
        })
      );
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  searchDestinatii(): void {
    if (this.searchTerm === '') {
      this.destinatii = [...this.originalDestinatii];
    } else {
      this.destinatii = this.destinatii.filter((destinatie) =>
        destinatie.locatie.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  creareRezervare() {
    if (!this.selectedDestination) {
      alert('Nu a fost selectată nicio destinație!');
      return;
    }

    if (!this.fromDate || !this.toDate) {
      alert('Selectați date valide pentru început și sfârșit!');
      return;
    }

    const dataInceput: string = `${this.fromDate.year}-${
      this.fromDate.month < 10 ? '0' + this.fromDate.month : this.fromDate.month
    }-${this.fromDate.day < 10 ? '0' + this.fromDate.day : this.fromDate.day}`;
    const dataSfarsit: string = `${this.toDate.year}-${
      this.toDate.month < 10 ? '0' + this.toDate.month : this.toDate.month
    }-${this.toDate.day < 10 ? '0' + this.toDate.day : this.toDate.day}`;

    this.destinatiiService
      .createRezervare(
        this.selectedDestination,
        this.loggedUserId,
        dataInceput,
        dataSfarsit
      )
      .subscribe(
        () => {
          alert('Rezervare creată cu succes!');
        },
        (error) => {
          if (error.error && error.error.message) {
            alert(error.error.message);
          } else {
            alert(
              'A apărut o eroare. Vă rugăm să încercați din nou mai târziu.'
            );
          }
        }
      );
  }
}
