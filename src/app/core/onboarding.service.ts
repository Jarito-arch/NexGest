import { Injectable, signal } from '@angular/core';

/** Estado en memoria del onboarding (sin persistencia / backend). */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  readonly businessName = signal('');
  readonly category = signal('');
  readonly teamSize = signal('');

  readonly activities = signal<string[]>([]);
  readonly frequency = signal('');

  readonly modules = signal<string[]>([]);
  readonly goals = signal<string[]>([]);

  toggle(list: ReturnType<typeof signal<string[]>>, value: string): void {
    list.update((items) =>
      items.includes(value) ? items.filter((i) => i !== value) : [...items, value],
    );
  }
}
