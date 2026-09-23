import { Injectable, signal } from '@angular/core';

export interface EventItem {
  id: string;
  title: string;
  category: 'Tech' | 'Music' | 'Networking' | 'Food & Wine' | 'Arts' | 'Sports';
  hostName: string;
  hostAvatar: string;
  hostRole: string;
  location: string;
  coordinates: { x: number; y: number }; // Percentage on map
  date: string;
  time: string;
  price: string;
  image: string;
  spotsLeft: number;
  featured?: boolean;
}

export interface ToastMessage {
  id: number;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventDataService {
  toasts = signal<ToastMessage[]>([]);
  activeMapPin = signal<EventItem | null>(null);
  activeModal = signal<'guest' | 'host' | null>(null);

  readonly mockEvents: EventItem[] = [
    {
      id: 'evt-1',
      title: 'AI & Web Architecture Summit 2026',
      category: 'Tech',
      hostName: 'DevPulse DC',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      hostRole: 'Verified Host',
      location: 'Dupont Circle, Washington D.C.',
      coordinates: { x: 68, y: 32 },
      date: 'Oct 14, 2026',
      time: '6:00 PM EST',
      price: '$49 / Guest',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      spotsLeft: 18,
      featured: true
    },
    {
      id: 'evt-2',
      title: 'Sunset Potomac Synthwave Session',
      category: 'Music',
      hostName: 'Georgetown Sound Collective',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      hostRole: 'Pro Venue Partner',
      location: 'Georgetown Waterfront, Washington D.C.',
      coordinates: { x: 74, y: 44 },
      date: 'Oct 18, 2026',
      time: '8:30 PM EST',
      price: '$25 / Guest',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      spotsLeft: 42,
      featured: true
    },
    {
      id: 'evt-3',
      title: 'Policy, SaaS & Tech Founders Mixer',
      category: 'Networking',
      hostName: 'Capitol Hill Venture Club',
      hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      hostRole: 'Verified Host',
      location: 'Capitol Hill, Washington D.C.',
      coordinates: { x: 84, y: 52 },
      date: 'Oct 22, 2026',
      time: '5:30 PM EST',
      price: 'Free Pass',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
      spotsLeft: 7,
      featured: true
    },
    {
      id: 'evt-4',
      title: 'Artisan Culinary & Fine Wine Gala',
      category: 'Food & Wine',
      hostName: 'Chef Julien Laurent',
      hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      hostRole: 'Master Host',
      location: 'Penn Quarter, Washington D.C.',
      coordinates: { x: 64, y: 58 },
      date: 'Nov 02, 2026',
      time: '7:00 PM EST',
      price: '$85 / Guest',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
      spotsLeft: 12,
      featured: false
    },
    {
      id: 'evt-5',
      title: 'DC 3D Visual & Digital Arts Expo',
      category: 'Arts',
      hostName: 'Adams Morgan Studios',
      hostAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      hostRole: 'Pro Organizer',
      location: 'Adams Morgan, Washington D.C.',
      coordinates: { x: 72, y: 22 },
      date: 'Nov 12, 2026',
      time: '2:00 PM EST',
      price: '$30 / Guest',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      spotsLeft: 35,
      featured: true
    },
    {
      id: 'evt-6',
      title: 'Tidal Basin Cherry Blossom Run & Wellness',
      category: 'Sports',
      hostName: 'DC Fitness Alliance',
      hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      hostRole: 'Verified Host',
      location: 'Tidal Basin, Washington D.C.',
      coordinates: { x: 82, y: 68 },
      date: 'Nov 20, 2026',
      time: '6:30 AM EST',
      price: '$18 / Guest',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
      spotsLeft: 24,
      featured: false
    }
  ];

  notifyInterest(event: EventItem) {
    this.showToast(
      'success',
      'RSVP Interest Saved!',
      `You've registered interest for "${event.title}" in ${event.location}.`
    );
    this.activeMapPin.set(null);
  }

  showToast(type: 'success' | 'info' | 'warning', title: string, message: string) {
    const newToast: ToastMessage = {
      id: Date.now(),
      type,
      title,
      message
    };
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.removeToast(newToast.id);
    }, 4500);
  }

  removeToast(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
