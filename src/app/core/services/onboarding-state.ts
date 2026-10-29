import { Service, signal, WritableSignal } from '@angular/core';

/** Estado en memoria de las respuestas del onboarding (pasos 1 a 5). */
@Service()
export class OnboardingService {
  businessName = signal('');
  category = signal('');
  teamSize = signal('');
  activities = signal<string[]>([]);
  frequency = signal('');
  modules = signal<string[]>([]);
  goals = signal<string[]>([]);

  toggle(list: WritableSignal<string[]>, value: string) {
    list.update((items) =>
      items.includes(value) ? items.filter((i) => i !== value) : [...items, value],
    );
  }
}
