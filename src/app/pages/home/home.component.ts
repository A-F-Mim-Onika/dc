import { Component, computed, signal, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { WaitlistFormComponent } from '../../components/waitlist-form/waitlist-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    WaitlistFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('whoWeAreSection') whoWeAreSection?: ElementRef<HTMLElement>;
  @ViewChild('whatWeDoContainer') whatWeDoContainer?: ElementRef<HTMLElement>;
  @ViewChild('whatWeDoTrack') whatWeDoTrack?: ElementRef<HTMLElement>;
  @ViewChild('waitlistForm') waitlistForm?: WaitlistFormComponent;

  whoWeAreVisible = signal<boolean>(false);
  trackTransform = signal<string>('translate3d(0px, 0px, 0px)');
  scrollProgress = signal<number>(0);

  cardStyles = computed(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return [
        { opacity: '1', transform: 'none', pointerEvents: 'auto' },
        { opacity: '1', transform: 'none', pointerEvents: 'auto' },
        { opacity: '1', transform: 'none', pointerEvents: 'auto' }
      ];
    }

    const p = this.scrollProgress();

    // Card 1 starts as header rises 50px above bottom (duration = 0.30, p = 0.02 to 0.32)
    const p0 = Math.min(1, Math.max(0, (p - 0.02) / 0.30));

    // Card 2 starts when Card 1 is 80% there (0.02 + 0.8 * 0.30 = 0.26)
    const p1 = Math.min(1, Math.max(0, (p - 0.26) / 0.30));

    // Card 3 starts when Card 2 is 80% there (0.26 + 0.8 * 0.30 = 0.50)
    const p2 = Math.min(1, Math.max(0, (p - 0.50) / 0.30));

    const computeStyle = (val: number) => {
      const translateX = (1 - val) * 120;
      const scale = 0.93 + val * 0.07;
      return {
        opacity: val.toFixed(3),
        transform: `translate3d(${translateX.toFixed(1)}px, 0px, 0px) scale(${scale.toFixed(3)})`,
        pointerEvents: val > 0.3 ? 'auto' : 'none'
      };
    };

    return [
      computeStyle(p0),
      computeStyle(p1),
      computeStyle(p2)
    ];
  });

  ngAfterViewInit(): void {
    this.updateHorizontalScroll();

    if (typeof IntersectionObserver !== 'undefined' && this.whoWeAreSection?.nativeElement) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.whoWeAreVisible.set(true);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(this.whoWeAreSection.nativeElement);
    } else {
      this.whoWeAreVisible.set(true);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.values-section .value-card').forEach(card => {
        cardObserver.observe(card);
      });
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateHorizontalScroll(): void {
    if (typeof window === 'undefined') return;

    if (this.whoWeAreSection?.nativeElement) {
      const rect = this.whoWeAreSection.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        this.whoWeAreVisible.set(true);
      }
    }

    // Gradually reveal "What we believe" cards as user scrolls down
    document.querySelectorAll('.values-section .value-card:not(.is-visible)').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        card.classList.add('is-visible');
      }
    });

    if (window.innerWidth <= 768) {
      this.scrollProgress.set(1);
      this.trackTransform.set('translate3d(0px, 0px, 0px)');
      return;
    }
    if (!this.whatWeDoContainer?.nativeElement) {
      return;
    }

    const container = this.whatWeDoContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger point: a few pixels (50px) above the bottom line of the screen
    const triggerOffset = 50;
    const triggerPoint = windowHeight - triggerOffset;
    const totalRange = (rect.height - windowHeight) + triggerPoint;

    if (totalRange <= 0) {
      this.scrollProgress.set(0);
      this.trackTransform.set('translate3d(0px, 0px, 0px)');
      return;
    }

    // Distance scrolled since the header passed 50px above the bottom of the screen
    const currentDistance = triggerPoint - rect.top;
    const progress = Math.min(1, Math.max(0, currentDistance / totalRange));
    this.scrollProgress.set(progress);

    // Keep track locked at 0px so Card 1 never scrolls past the left-aligned margin
    this.trackTransform.set('translate3d(0px, 0px, 0px)');
  }

  scrollToForm(role?: 'guest' | 'host'): void {
    if (role && this.waitlistForm) {
      this.waitlistForm.setIntent(role);
    }
    const el = document.getElementById('waitlist-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
