import { Component, Input } from '@angular/core';


@Component({

  selector: 'app-checkbox-option',

  standalone: true,

  imports: [],

  templateUrl: './checkbox-option.html',

  styleUrl: './checkbox-option.scss'

})


export class CheckboxOptionComponent {


  @Input() title:string = '';

  @Input() selected:boolean = false;


}