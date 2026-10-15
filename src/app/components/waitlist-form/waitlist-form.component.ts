import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-waitlist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './waitlist-form.component.html',
  styleUrl: './waitlist-form.component.css'
})
export class WaitlistFormComponent {
  private fb = inject(FormBuilder);

  readonly palette = ['#c084fc', '#f59e0b', '#10b981', '#ec4899', '#a855f7', '#fb923c', '#d946ef', '#eab308'];

  interestOptions = signal([
    { name: 'Walks', color: '#10b981', icon: '🚶' },
    { name: 'Coffee meetups', color: '#f59e0b', icon: '☕' },
    { name: 'Food & dining', color: '#fb923c', icon: '🍜' },
    { name: 'Trivia', color: '#eab308', icon: '🎯' },
    { name: 'Art', color: '#ec4899', icon: '🎨' },
    { name: 'Brunch', color: '#f97316', icon: '🥞' },
    { name: 'Game nights', color: '#c084fc', icon: '🎲' },
    { name: 'Language exchange', color: '#d946ef', icon: '🌐' },
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

  submitting = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  messageLength = computed(() => this.form.controls.message.value.length);

  setIntent(val: 'guest' | 'host'): void {
    this.selectedIntent.set(val);
    this.form.controls.intent.setValue(val);
  }

  addCustomInterest(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const val = this.form.controls.otherInterest.value.trim();
    if (!val) return;

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

    const currentInterests = this.form.controls.interests.value;
    if (!currentInterests.includes(val)) {
      this.form.controls.interests.setValue([...currentInterests, val]);
    }

    this.form.controls.otherInterest.setValue('');
    this.showOtherInput.set(false);
  }

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

    setTimeout(() => {
      console.log('Interest form submitted:', payload);
      this.submitting.set(false);
      this.submitted.set(true);
    }, 800);
  }

  viewEvents(): void {
    const el = document.getElementById('what-we-do');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  reset(): void {
    this.selectedIntent.set('guest');
    this.showOtherInput.set(false);
    this.form.reset({ intent: 'guest' });
    this.submitted.set(false);
  }
}
