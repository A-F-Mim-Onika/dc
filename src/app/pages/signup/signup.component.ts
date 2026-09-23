import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  eventService = inject(EventDataService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  step = signal<number>(1);
  selectedRole = signal<'guest' | 'host'>('guest');
  selectedPlan = signal<string>('Free Member');

  name = '';
  email = '';
  password = '';
  city = 'San Francisco, CA';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'host') {
        this.selectedRole.set('host');
        this.selectedPlan.set('Starter Host');
      } else if (params['role'] === 'guest') {
        this.selectedRole.set('guest');
        this.selectedPlan.set('Free Member');
      }
    });
  }

  goToStep(s: number) {
    if (s === 2 && !this.selectedRole()) {
      this.eventService.showToast('warning', 'Select Role', 'Please select whether you are a Guest or a Host.');
      return;
    }
    if (s === 3 && (!this.name || !this.email)) {
      this.eventService.showToast('warning', 'Missing Fields', 'Please complete your name and email address.');
      return;
    }
    this.step.set(s);
  }

  completeRegistration() {
    this.eventService.showToast(
      'success',
      'Account Created Successfully!',
      `Welcome to MeetMap, ${this.name}! Registered as ${this.selectedRole() === 'guest' ? 'Member' : 'Organizer'}.`
    );
    this.router.navigate(['/']);
  }
}
