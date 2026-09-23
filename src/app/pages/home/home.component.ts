import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MapBackgroundComponent } from '../../components/map-background/map-background.component';
import { GuestFormComponent } from '../../components/guest-form/guest-form.component';
import { HostFormComponent } from '../../components/host-form/host-form.component';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MapBackgroundComponent,
    GuestFormComponent,
    HostFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  eventService = inject(EventDataService);

  // Entrance progress loading state (video reference inspired)
  loadingState = signal<number>(0);

  // Active modal signal shared via EventDataService
  activeModal = this.eventService.activeModal;

  ngOnInit() {
    // Entrance loader animation (0% -> 17% -> 65% -> 100%)
    setTimeout(() => this.loadingState.set(17), 150);
    setTimeout(() => this.loadingState.set(65), 350);
    setTimeout(() => this.loadingState.set(100), 600);
  }

  openGuestModal() {
    this.eventService.activeModal.set('guest');
  }

  openHostModal() {
    this.eventService.activeModal.set('host');
  }

  closeModal() {
    this.eventService.activeModal.set(null);
  }
}

