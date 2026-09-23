import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-guest-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.css'
})
export class GuestFormComponent {
  eventService = inject(EventDataService);

  categories: ('Tech' | 'Music' | 'Networking' | 'Food & Wine' | 'Arts' | 'Sports')[] = [
    'Tech', 'Music', 'Networking', 'Food & Wine', 'Arts', 'Sports'
  ];

  selectedCategories: string[] = ['Tech', 'Networking'];
  name = '';
  email = '';
  city = 'San Francisco, CA';
  frequency = 'Weekly Digest';
  submitted = signal<boolean>(false);
  passNumber = Math.floor(1000 + Math.random() * 9000);

  toggleCategory(cat: string) {
    if (this.selectedCategories.includes(cat)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
    } else {
      this.selectedCategories.push(cat);
    }
  }

  onSubmit() {
    if (!this.name || !this.email) {
      this.eventService.showToast('warning', 'Missing Details', 'Please enter your name and email address.');
      return;
    }

    this.submitted.set(true);
    this.eventService.showToast(
      'success',
      'Welcome to MeetMap!',
      `Guest Discovery Pass generated for ${this.name}. Check ${this.email} for initial event drops.`
    );
  }

  resetForm() {
    this.submitted.set(false);
    this.name = '';
    this.email = '';
  }
}
