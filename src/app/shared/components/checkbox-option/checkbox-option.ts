import { Component, Input } from '@angular/core';


@Component({

  selector: 'app-checkbox-option',

  standalone: true,

  imports: [],

  templateUrl: './checkbox-option-component.html',

  styleUrl: './checkbox-option-component.scss'

})


export class CheckboxOptionComponent {


  @Input() title:string = '';

  @Input() selected:boolean = false;


}