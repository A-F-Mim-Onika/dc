import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MapBackgroundComponent } from '../../components/map-background-dc/map-background.component';
// import { FooterComponent } from '../../components/footer/footer.component';

type Role = 'guest' | 'host';

@Component({
  selector: 'app-interest-form',
  imports: [ReactiveFormsModule, MapBackgroundComponent],
  templateUrl: './interest-form.component.html',
  styleUrl: './interest-form.component.css'
})
export class InterestFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly palette = ['#38bdf8', '#f59e0b', '#10b981', '#ec4899', '#a855f7', '#fb923c', '#06b6d4', '#eab308'];

  interestOptions = signal([
    { name: 'Walks', color: '#10b981', icon: '🚶' },
    { name: 'Coffee meetups', color: '#f59e0b', icon: '☕' },
    { name: 'Food & dining', color: '#fb923c', icon: '🍜' },
    { name: 'Trivia', color: '#eab308', icon: '🎯' },
    { name: 'Art', color: '#ec4899', icon: '🎨' },
    { name: 'Brunch', color: '#f97316', icon: '🥞' },
    { name: 'Game nights', color: '#38bdf8', icon: '🎲' },
    { name: 'Language exchange', color: '#06b6d4', icon: '🌐' },
    { name: 'Workshops', color: '#a855f7', icon: '💡' },
    { name: 'Live music', color: '#f43f5e', icon: '🎵' },
    { name: 'Networking', color: '#14b8a6', icon: '🤝' },
  ]);

  selectedIntent = signal<'guest' | 'host'>('guest');
  showOtherInput = signal(false);

  form = this.fb.nonNullable.group({
    intent: ['guest' as 'guest' | 'host', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    interests: [[] as string[]],
    otherInterest: [''],
    message: ['', Validators.maxLength(500)],
  });

  addCustomInterest(event?: Event): void {
    if (event) {
      event.preventDefault(); // Prevents accidental form submission on Enter
    }
    const val = this.form.controls.otherInterest.value.trim();
    if (!val) return;

    // Check if not already existing
    const exists = this.interestOptions().some(
      (opt) => opt.name.toLowerCase() === val.toLowerCase()
    );

    if (!exists) {
      const color = this.palette[this.interestOptions().length % this.palette.length];
      this.interestOptions.update((opts) => [
        ...opts,
        { name: val, color, icon: '✨' }
      ]);
    }

    // Automatically select the new chip
    const currentInterests = this.form.controls.interests.value;
    if (!currentInterests.includes(val)) {
      this.form.controls.interests.setValue([...currentInterests, val]);
    }

    // Clear input and collapse
    this.form.controls.otherInterest.setValue('');
    this.showOtherInput.set(false);
  }

  setIntent(val: 'guest' | 'host') {
    this.selectedIntent.set(val);
    this.form.controls.intent.setValue(val);
  }

  submitting = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  messageLength = computed(() => this.form.controls.message.value.length);

  isInvalid(name: 'name' | 'email' | 'city' | 'message'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  isSelected(interest: string): boolean {
    return this.form.controls.interests.value.includes(interest);
  }

  toggleInterest(interest: string): void {
    const ctrl = this.form.controls.interests;
    const current = ctrl.value;
    ctrl.setValue(
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest]
    );
  }

  toggleOther(): void {
    this.showOtherInput.update((v) => !v);
    if (!this.showOtherInput()) {
      this.form.controls.otherInterest.setValue('');
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue();

    // TODO: replace with your real API call, e.g.
    // this.interestService.submit(payload).subscribe({ next: ..., error: ... })
    setTimeout(() => {
      console.log('Interest form submitted:', payload);
      this.submitting.set(false);
      this.submitted.set(true);
    }, 800);
  }

  viewEvents(): void {
    // Change '/events' to match your events page route
    this.router.navigate(['/events']);
  }

  reset(): void {
    this.selectedIntent.set('guest');
    this.showOtherInput.set(false);
    this.form.reset({ intent: 'guest' });
    this.submitted.set(false);
  }
}

