import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDataService, EventItem } from '../../services/event-data.service';

@Component({
  selector: 'app-map-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-background.component.html',
  styleUrl: './map-background.component.css'
})
export class MapBackgroundComponent {
  eventService = inject(EventDataService);

  @Input() showPins = true;
  @Input() showAnimations = true;
  @Input() showColorfulRoads = true;

  selectPin(event: EventItem) {
    this.eventService.activeMapPin.set(event);
  }

  notifyInterest(event: EventItem) {
    this.eventService.showToast(
      'success',
      'RSVP Interest Saved!',
      `You've registered interest for "${event.title}" in ${event.location}.`
    );
    this.eventService.activeMapPin.set(null);
  }
}
