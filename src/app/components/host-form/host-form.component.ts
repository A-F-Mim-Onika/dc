import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-host-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-form.component.html',
  styleUrl: './host-form.component.css'
})
export class HostFormComponent {
  eventService = inject(EventDataService);

  brandName = '';
  email = '';
  hostType = 'Independent Creator';
  capacity = '50 - 250 Guests';
  concept = '';
  submitted = signal<boolean>(false);

  onSubmit() {
    if (!this.brandName || !this.email) {
      this.eventService.showToast('warning', 'Missing Details', 'Please enter your organization name and contact email.');
      return;
    }

    this.submitted.set(true);
    this.eventService.showToast(
      'success',
      'Host Application Received!',
      `Host profile created for "${this.brandName}". Pro features unlocked for ${this.email}.`
    );
  }

  resetForm() {
    this.submitted.set(false);
    this.brandName = '';
    this.email = '';
    this.concept = '';
  }
}
