import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface Destinatie {
  id: string;
  titlu: string;
  descriere: string;
  locatie: string;
  pret_per_noapte: number;
  numar_locuri: number;
  imagine: string;
  procent_reducere: number;
  showCalendar?: boolean;
  selectedDate?: NgbDate;
  showChart?: boolean;
}
