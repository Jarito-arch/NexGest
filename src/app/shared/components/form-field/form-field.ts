import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() value: string = '';
  @Input() error: string = '';
  @Input() autocomplete: string | null = null;

  /** Permite usar [(value)] */
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.valueChange.emit(next);
  }
}
