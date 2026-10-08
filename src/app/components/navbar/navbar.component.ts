import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,
    //  RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  eventService = inject(EventDataService);
  router = inject(Router);
  mobileMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 0);
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/signin') || url.includes('/signup');
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }

  openHostModal() {
    this.eventService.activeModal.set('host');
    this.closeMenu();
  }

  openGuestModal() {
    this.eventService.activeModal.set('guest');
    this.closeMenu();
  }
}
