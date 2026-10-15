import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  eventService = inject(EventDataService);
  annualBilling = signal<boolean>(false);

  toggleBilling() {
    this.annualBilling.update(v => !v);
  }

  contactSales() {
    this.eventService.showToast(
      'info',
      'Enterprise Support',
      'An enterprise event specialist will reach out to you at sales@corasel.com.'
    );
  }
}
