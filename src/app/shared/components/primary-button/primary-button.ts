import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.scss',
})
export class PrimaryButtonComponent {
  @Input() text: string = 'Continuar';
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() disabled: boolean = false;
}
