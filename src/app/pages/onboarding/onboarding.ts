import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { OnboardingLayoutComponent } 
from '../../shared/components/onboarding-layout-component/onboarding-layout-component';

import { StepIndicatorComponent } 
from '../../shared/components/step-indicator-component/step-indicator-component';

import { OnboardingCardComponent } 
from '../../shared/components/onboarding-card-component/onboarding-card-component';

import { OptionCardComponent } 
from '../../shared/components/option-card-component/option-card-component';



import {

  lucideUtensils,

  lucideShoppingCart,

  lucideBriefcaseBusiness,

  lucideFactory,

  lucideMonitor,

  lucideSparkles,

  lucideUser,

  lucideUsers,

  lucideBuilding2

} from '@ng-icons/lucide';



@Component({

  selector:'app-onboarding',

  standalone:true,


  imports:[

    CommonModule,

    OnboardingLayoutComponent,

    StepIndicatorComponent,

    OnboardingCardComponent,

    OptionCardComponent

  ],


  templateUrl:'./onboarding.html',

  styleUrl:'./onboarding.scss'

})


export class Onboarding {



businessTypes = [

{

icon: lucideUtensils,

title:'Alimentos y bebidas'

},


{

icon: lucideShoppingCart,

title:'Comercio'

},


{

icon: lucideBriefcaseBusiness,

title:'Servicios'

},


{

icon: lucideFactory,

title:'Manufactura'

},


{

icon: lucideMonitor,

title:'Tecnología'

},


{

icon: lucideSparkles,

title:'Otro'

}


];





teamSizes = [

{

icon: lucideUser,

title:'Solo yo'

},


{

icon: lucideUsers,

title:'2 - 5 personas'

},


{

icon: lucideUsers,

title:'6 - 10 personas'

},


{

icon: lucideBuilding2,

title:'Más de 10'

}


];


}