import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field-component.html',
  styleUrl: './form-field-component.scss'
})
export class FormFieldComponent {


  @Input()
  label:string = '';


  @Input()
  placeholder:string = '';


  @Input()
  type:string = 'text';


  @Input()
  value:string = '';

}