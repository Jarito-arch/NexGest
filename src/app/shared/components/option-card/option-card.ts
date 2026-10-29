import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';


@Component({

  selector: 'app-option-card',

  standalone: true,

  imports: [
    NgIcon
  ],

  templateUrl: './option-card.html',

  styleUrl: './option-card.scss'

})


export class OptionCardComponent {


  @Input() icon: any;

  @Input() title: string = '';

  @Input() selected: boolean = false;


}