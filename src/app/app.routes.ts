import { Routes } from '@angular/router';
import { AboutPageComponent } from './features/about/about-page.component';
import { GettingStartedPageComponent } from './features/getting-started/getting-started-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { LoginPageComponent } from './features/login/login-page.component';
import { PricingPageComponent } from './features/pricing/pricing-page.component';

const loadLegalPage = () =>
  import('./features/legal/legal-page.component').then((module) => module.LegalPageComponent);

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
  {
    path: 'terms',
    loadComponent: loadLegalPage,
    data: { document: 'terms' },
    title: 'Terms and Conditions | Motify',
  },
  {
    path: 'privacy',
    loadComponent: loadLegalPage,
    data: { document: 'privacy' },
    title: 'Privacy Policy | Motify',
  },
  {
    path: 'refund-policy',
    loadComponent: loadLegalPage,
    data: { document: 'refund' },
    title: 'Refund Policy | Motify',
  },
  { path: '**', redirectTo: '' },
];
