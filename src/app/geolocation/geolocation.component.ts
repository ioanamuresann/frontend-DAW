import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../shared/geolocation.service';
import * as L from 'leaflet';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
})
export class GeolocationComponent implements OnInit {
  latitude: any;
  longitude: any;
  map!: L.Map;

  constructor(
    private geolocationService: GeolocationService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getGeoLocation();
  }

  getGeoLocation() {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.initMap(this.latitude, this.longitude);
        this.saveLocation(this.latitude, this.longitude);
      },
      error: (error) => {
        console.error('Error getting geolocation:', error);
      },
    });
  }

  initMap(latitude: number, longitude: number): void {
    this.map = L.map('map', {
      center: [latitude, longitude],
      zoom: 17,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 30,
        minZoom: 10,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    const customIcon = L.divIcon({
      html: '<i class="bi bi-geo-fill"></i>',
    });

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('Aici este locația.')
      .openPopup();

    tiles.addTo(this.map);
  }

  saveLocation(latitude: number, longitude: number): void {
    this.cookieService.set('userLatitude', latitude.toString());
    this.cookieService.set('userLongitude', longitude.toString());
  }
}
