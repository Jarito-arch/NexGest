import { Component } from '@angular/core';

import { AuthLayoutComponent } from '../../shared/components/auth-layout-component/auth-layout-component';
import { AuthCardComponent } from '../../shared/components/auth-card-component/auth-card-component';
import { FormFieldComponent } from '../../shared/components/form-field-component/form-field-component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button-component/primary-button-component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AuthLayoutComponent,
    AuthCardComponent,
    FormFieldComponent,
    PrimaryButtonComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}