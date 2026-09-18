import { Routes } from '@angular/router';
import { AboutPageComponent } from './features/about/about-page.component';
import { GettingStartedPageComponent } from './features/getting-started/getting-started-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { LoginPageComponent } from './features/login/login-page.component';
import { PricingPageComponent } from './features/pricing/pricing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'Motify — AI Video Generator for SaaS Marketing',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Log in to Motify',
  },
  {
    path: 'signup',
    component: LoginPageComponent,
    data: { mode: 'signup' },
    title: 'Sign up for Motify',
  },
  {
    path: 'about',
    component: AboutPageComponent,
    title: 'About Motify | AI Motion Graphics Generator',
  },
  {
    path: 'getting-started',
    component: GettingStartedPageComponent,
    title: 'Install Motify - HTML and GSAP Motion Editor',
  },
  {
    path: 'pricing',
    component: PricingPageComponent,
    title: 'AI Video Generator Pricing | Motify',
  },
  { path: '**', redirectTo: '' },
];
