import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../shared/services/login.service';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  // providers: [LoginService]
})
export class OnboardingModule { }
