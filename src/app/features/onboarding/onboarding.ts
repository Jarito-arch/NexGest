import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../core/services/onboarding-state';


import { OnboardingLayoutComponent } 
from '../../layout/onboarding-layout/onboarding-layout';

import { StepIndicatorComponent } 
from '../../shared/components/step-indicator/step-indicator';

import { OnboardingCardComponent } 
from '../../shared/components/onboarding-card/onboarding-card';

import { OptionCardComponent } 
from '../../shared/components/option-card/option-card';



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

    OnboardingLayoutComponent,

    StepIndicatorComponent,

    OnboardingCardComponent,

    OptionCardComponent

  ],


  templateUrl:'./onboarding.html',

  styleUrl:'./onboarding.scss'

})


export class Onboarding {

state = inject(OnboardingService);
private router = inject(Router);

valid = computed(
  () => !!this.state.businessName().trim() && !!this.state.category() && !!this.state.teamSize()
);

onName(event: Event) {
  this.state.businessName.set((event.target as HTMLInputElement).value);
}

next() {
  if (this.valid()) this.router.navigate(['/onboarding/step2']);
}



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