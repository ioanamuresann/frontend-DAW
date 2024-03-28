import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destinatie } from './destinatie.interface';
import { DestinatieDTO } from './addDestination.dto';
import { Rezervare } from './rezervare.interface';

@Injectable({
  providedIn: 'root',
})
export class DestinatiiService {
  apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getDestinations(): Observable<Destinatie[]> {
    return this.http.get<Destinatie[]>(`${this.apiUrl}/destinatii`);
  }

  createDestination(destinatieData: DestinatieDTO) {
    return this.http.post(`${this.apiUrl}/destinatii`, destinatieData);
  }

  updateDestination(destinatieId: string, destinatieData: Destinatie) {
    return this.http.put(
      `${this.apiUrl}/destinatii/${destinatieId}`,
      destinatieData
    );
  }

  deleteDestination(destinatieId: string) {
    return this.http.delete(`${this.apiUrl}/destinatii/${destinatieId}`);
  }

  createRezervare(
    destinatieId: string,
    userId: string,
    dataInceput: string,
    dataSfarsit: string
  ) {
    const url = `${this.apiUrl}/destinatii/${destinatieId}/rezervari`;
    const body = {
      user_id: userId,
      data_inceput: dataInceput,
      data_sfarsit: dataSfarsit,
    };
    return this.http.post(url, body);
  }

  verificaDisponibilitate(
    destinatieId: string,
    dataInceput: string,
    dataSfarsit: string
  ) {
    const body = {
      data_inceput: dataInceput,
      data_sfarsit: dataSfarsit,
    };

    return this.http.post<any>(
      `${this.apiUrl}/destinatii/${destinatieId}/verificare-disponibilitate`,
      body
    );
  }

  getRezervariForDestinatie(destinatieId: string): Observable<Rezervare[]> {
    return this.http.get<Rezervare[]>(
      `${this.apiUrl}/destinatii/${destinatieId}/rezervari`
    );
  }

  getNumarRezervariInLuna(
    destinatieId: string,
    an: string,
    luna: string
  ): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}/destinatii/${destinatieId}/rezervari/luna`,
      { an, luna }
    );
  }
}
