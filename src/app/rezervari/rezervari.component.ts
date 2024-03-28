import { Component, OnInit } from '@angular/core';
import { DestinatiiService } from '../shared/destinatii.service';
import { Destinatie } from '../shared/destinatie.interface';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Rezervare } from '../shared/rezervare.interface';

@Component({
  selector: 'app-rezervari',
  standalone: true,
  imports: [CommonModule, NgbDatepicker, FormsModule],
  templateUrl: './rezervari.component.html',
  styleUrl: './rezervari.component.scss',
})
export class RezervariComponent implements OnInit {
  onDateSelect($event: NgbDate, _t7: Destinatie) {
    throw new Error('Method not implemented.');
  }
  destinatii: Destinatie[] = [];
  rezervari: Rezervare[] = [];

  constructor(
    private destinatiiService: DestinatiiService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.getDestinations();
  }

  getDestinations(): void {
    this.destinatiiService.getDestinations().subscribe(
      (data: Destinatie[]) => {
        this.destinatii = data;
      },
      (error: any) => {
        console.error('Error fetching destinations:', error);
      }
    );
  }

  showCalendar(destinatie: Destinatie): void {
    destinatie.showCalendar = !destinatie.showCalendar;
    if (destinatie.showCalendar) {
      destinatie.selectedDate = this.calendar.getToday();
    }

    this.verificareRezervari(destinatie);
  }

  verificareRezervari(destinatie: Destinatie): void {
    this.destinatiiService.getRezervariForDestinatie(destinatie.id).subscribe(
      (rezervari: Rezervare[]) => {
        this.rezervari = rezervari;
      },
      (error: any) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }

  dateHasReservation(date: NgbDate, destinatie: Destinatie): boolean {
    const currentDate = new Date(date.year, date.month - 1, date.day);

    const rezervareExists = this.rezervari.some((rezervare) => {
      const rezervareStartDate = new Date(rezervare.data_inceput);
      rezervareStartDate.setDate(rezervareStartDate.getDate() - 1);

      const rezervareEndDate = new Date(rezervare.data_sfarsit);
      return (
        currentDate >= rezervareStartDate && currentDate <= rezervareEndDate
      );
    });

    return rezervareExists;
  }

  showStatistics(destinatie: Destinatie): void {
    destinatie.showChart = !destinatie.showChart;

    const numarRezervariLuna: number[] = [];
    const numarLuni = 12;
    const an = '2024';
    const numeLuni = [
      'Ian',
      'Feb',
      'Mar',
      'Apr',
      'Mai',
      'Iun',
      'Iul',
      'Aug',
      'Sep',
      'Oct',
      'Noi',
      'Dec',
    ];

    for (let luna = 1; luna <= numarLuni; luna++) {
      const numarLuna = luna < 10 ? '0' + luna : '' + luna;
      this.destinatiiService
        .getNumarRezervariInLuna(destinatie.id, an, numarLuna)
        .subscribe((numarRezervari: number) => {
          numarRezervariLuna.push(numarRezervari);
          if (numarRezervariLuna.length === numarLuni) {
            this.renderChart(numarRezervariLuna, numeLuni);
          }
        });
    }
  }

  renderChart(numarRezervariLuna: number[], numeLuni: string[]): void {
    const chartDom = document.getElementById('main');

    const myChart = echarts.init(chartDom);

    const option = {
      xAxis: {
        type: 'category',
        data: numeLuni,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: numarRezervariLuna,
          type: 'bar',
        },
      ],
    };

    myChart.setOption(option);
  }
}
