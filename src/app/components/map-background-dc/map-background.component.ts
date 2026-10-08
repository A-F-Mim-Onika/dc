import { Component, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-map-background-dc',
  standalone: true,
  templateUrl: './map-background.component.html',
  styleUrl: './map-background.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapBackgroundComponent {
  mouseX = signal<number>(-1000);
  mouseY = signal<number>(-1000);
  isHovered = signal<boolean>(false);

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX.set(e.clientX);
    this.mouseY.set(e.clientY);
    if (!this.isHovered()) {
      this.isHovered.set(true);
    }
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.isHovered.set(false);
  }
}

