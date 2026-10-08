import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DcPin {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'guest' | 'host'; // guest = #1EA7FF, host = #F5A623
  labelPos: 'top' | 'bottom' | 'left' | 'right';
  labelDx: number;
  labelDy: number;
  delay: string; // for pulse stagger
  order: number; // for rotating fade in / fade out
}

export interface DcDottedArc {
  d: string;
  delay: string;
}

@Component({
  selector: 'app-dc-map-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dc-map-background.component.html',
  styleUrl: './dc-map-background.component.css'
})
export class DcMapBackgroundComponent implements OnInit, OnDestroy {
  // 9 glowing pins at approximate positions for DC landmarks & neighborhoods
  // Form card sits at center (~width 640px, around x: 500-1100 in 1600x1000 viewport)
  // Pin labels placed so they do not overlap each other and sit clearly visible.
  readonly allPins: DcPin[] = [
    {
      id: 'georgetown',
      name: 'Georgetown',
      x: 320,
      y: 390,
      type: 'guest',
      labelPos: 'left',
      labelDx: -18,
      labelDy: 4,
      delay: '0s',
      order: 0
    },
    {
      id: 'adams-morgan',
      name: 'Adams Morgan',
      x: 480,
      y: 190,
      type: 'host',
      labelPos: 'top',
      labelDx: 0,
      labelDy: -18,
      delay: '0.8s',
      order: 1
    },
    {
      id: 'dupont-circle',
      name: 'Dupont Circle',
      x: 460,
      y: 330,
      type: 'guest',
      labelPos: 'left',
      labelDx: -18,
      labelDy: 4,
      delay: '1.6s',
      order: 2
    },
    {
      id: 'u-street',
      name: 'U Street',
      x: 640,
      y: 160,
      type: 'host',
      labelPos: 'top',
      labelDx: 0,
      labelDy: -18,
      delay: '2.4s',
      order: 3
    },
    {
      id: 'national-mall',
      name: 'National Mall',
      x: 720,
      y: 530,
      type: 'guest',
      labelPos: 'bottom',
      labelDx: 0,
      labelDy: 22,
      delay: '3.2s',
      order: 4
    },
    {
      id: 'capitol-hill',
      name: 'Capitol Hill',
      x: 1220,
      y: 530,
      type: 'host',
      labelPos: 'right',
      labelDx: 18,
      labelDy: 4,
      delay: '0.5s',
      order: 5
    },
    {
      id: 'navy-yard',
      name: 'Navy Yard',
      x: 1180,
      y: 740,
      type: 'guest',
      labelPos: 'right',
      labelDx: 18,
      labelDy: 4,
      delay: '1.3s',
      order: 6
    },
    {
      id: 'shaw',
      name: 'Shaw',
      x: 960,
      y: 180,
      type: 'guest',
      labelPos: 'right',
      labelDx: 18,
      labelDy: 4,
      delay: '2.1s',
      order: 7
    },
    {
      id: 'wharf',
      name: 'The Wharf',
      x: 580,
      y: 690,
      type: 'host',
      labelPos: 'bottom',
      labelDx: 0,
      labelDy: 22,
      delay: '2.9s',
      order: 8
    }
  ];

  // 4 faint curved dotted arcs between pins
  readonly arcs: DcDottedArc[] = [
    // Georgetown to Dupont Circle
    { d: 'M 320 390 Q 380 340 460 330', delay: '0s' },
    // Dupont Circle to U Street
    { d: 'M 460 330 Q 530 220 640 160', delay: '1s' },
    // Shaw to Capitol Hill
    { d: 'M 960 180 Q 1120 320 1220 530', delay: '2s' },
    // Capitol Hill to Navy Yard
    { d: 'M 1220 530 Q 1230 650 1180 740', delay: '3s' }
  ];

  // Track the pin that is currently transitioning out/in every ~6 seconds
  fadingPinIndex = signal<number>(-1);
  private timerRef: any;

  ngOnInit() {
    let current = 0;
    // Every 6s cycle through pins: fade one out, next interval fade back in
    this.timerRef = setInterval(() => {
      this.fadingPinIndex.set(current % this.allPins.length);
      current++;
    }, 6000);
  }

  ngOnDestroy() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
  }

  isPinHidden(index: number): boolean {
    return this.fadingPinIndex() === index;
  }
}
