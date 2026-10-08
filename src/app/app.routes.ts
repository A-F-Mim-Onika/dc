import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { InterestFormComponent } from "./pages/interest-form/interest-form.component";
import { AboutUsComponent } from './pages/about-us/about-us.component';

export const routes: Routes = [
  { path: '', component: InterestFormComponent },
  // { path: "home", component: HomeComponent },
  // { path: 'about', component: AboutUsComponent },
  // { path: 'pricing', component: PricingComponent },
  // { path: 'signin', component: SigninComponent },
  // { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
