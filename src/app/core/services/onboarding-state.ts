import { Service, signal, WritableSignal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'nexgest-onboarding';

/** Respuestas del onboarding (pasos 1 a 5). Se guardan en localStorage para sobrevivir a una recarga. */
@Service()
export class OnboardingService {
  private platformId = inject(PLATFORM_ID);

  businessName = signal('');
  category = signal('');
  teamSize = signal('');
  activities = signal<string[]>([]);
  frequency = signal('');
  modules = signal<string[]>([]);
  goals = signal<string[]>([]);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.load();
    effect(() => {
      const data = {
        businessName: this.businessName(),
        category: this.category(),
        teamSize: this.teamSize(),
        activities: this.activities(),
        frequency: this.frequency(),
        modules: this.modules(),
        goals: this.goals(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Sin almacenamiento disponible: las respuestas siguen en memoria.
      }
    });
  }

  toggle(list: WritableSignal<string[]>, value: string) {
    list.update((items) =>
      items.includes(value) ? items.filter((i) => i !== value) : [...items, value],
    );
  }

  /** ¿El usuario respondió algo útil para personalizar la experiencia? */
  hasAnswers(): boolean {
    return !!(this.modules().length || this.goals().length || this.category() || this.teamSize());
  }

  /** Borra las respuestas (por ejemplo, al crear una cuenta nueva). */
  reset() {
    this.businessName.set('');
    this.category.set('');
    this.teamSize.set('');
    this.activities.set([]);
    this.frequency.set('');
    this.modules.set([]);
    this.goals.set([]);
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Record<string, unknown>;
      const text = (v: unknown) => (typeof v === 'string' ? v : '');
      const list = (v: unknown) => (Array.isArray(v) ? v.filter((i): i is string => typeof i === 'string') : []);
      this.businessName.set(text(data['businessName']));
      this.category.set(text(data['category']));
      this.teamSize.set(text(data['teamSize']));
      this.activities.set(list(data['activities']));
      this.frequency.set(text(data['frequency']));
      this.modules.set(list(data['modules']));
      this.goals.set(list(data['goals']));
    } catch {
      // Datos corruptos: se empieza de cero.
    }
  }
}
