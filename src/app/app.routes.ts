import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { DestinatiiComponent } from './destinatii/destinatii.component';
import { LayoutComponent } from './layout/layout.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { AgentComponent } from './agent/agent.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { RezervariComponent } from './rezervari/rezervari.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'pack&go',
    component: LayoutComponent,
    children: [
      { path: 'acasa', component: HomeComponent },
      { path: 'destinatii', component: DestinatiiComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'agent', component: AgentComponent },
      { path: 'locatie', component: GeolocationComponent },
      { path: 'rezervari', component: RezervariComponent },
    ],
    canActivate: [AuthGuard],
  },
];
