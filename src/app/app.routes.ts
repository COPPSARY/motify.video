import { Routes } from '@angular/router';
import { AboutPageComponent } from './features/about/about-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { LoginPageComponent } from './features/login/login-page.component';
import { PartnersPageComponent } from './features/partners/partners-page.component';
import { PricingPageComponent } from './features/pricing/pricing-page.component';
import { NotFoundPageComponent } from './features/not-found/not-found-page.component';
import { HelpPageComponent } from './features/resources/help-page.component';
import { HelpTopicPageComponent } from './features/resources/help-topic-page.component';
import { PromptTemplatesPageComponent } from './features/resources/prompt-templates-page.component';
import { ResourceCategoryPageComponent } from './features/resources/resource-category-page.component';
import { ResourcesHubPageComponent } from './features/resources/resources-hub-page.component';

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
    path: 'partners',
    component: PartnersPageComponent,
    title: 'Partner with Motify | Agencies, Creators & Tech Partners',
  },
  {
    path: 'getting-started',
    redirectTo: 'resources/start-here',
    pathMatch: 'full',
  },
  {
    path: 'resources',
    component: ResourcesHubPageComponent,
    title: 'Product Marketing Resources | Motify',
  },
  {
    path: 'resources/start-here',
    component: ResourceCategoryPageComponent,
    data: { category: 'start-here' },
    title: 'Start Here | Motify Resources',
  },
  {
    path: 'resources/brand-dna',
    component: ResourceCategoryPageComponent,
    data: { category: 'brand-dna' },
    title: 'Brand DNA | Motify Resources',
  },
  {
    path: 'resources/prompt-templates',
    component: PromptTemplatesPageComponent,
    title: 'Product Marketing Prompt Templates | Motify',
  },
  {
    path: 'resources/playbooks',
    component: ResourceCategoryPageComponent,
    data: { category: 'playbooks' },
    title: 'Product Marketing Playbooks | Motify Resources',
  },
  {
    path: 'resources/video-craft',
    component: ResourceCategoryPageComponent,
    data: { category: 'video-craft' },
    title: 'Video Craft | Motify Resources',
  },
  {
    path: 'resources/examples',
    component: ResourceCategoryPageComponent,
    data: { category: 'examples' },
    title: 'Examples & Inspiration | Motify Resources',
  },
  {
    path: 'help',
    component: HelpPageComponent,
    title: 'Help & Product Guidance | Motify',
  },
  {
    path: 'help/account',
    component: HelpTopicPageComponent,
    data: { topic: 'account' },
    title: 'Account & Credits | Motify Help',
  },
  {
    path: 'help/brand-dna',
    component: HelpTopicPageComponent,
    data: { topic: 'brand-dna' },
    title: 'Brand DNA Setup | Motify Help',
  },
  {
    path: 'help/inputs',
    component: HelpTopicPageComponent,
    data: { topic: 'inputs' },
    title: 'Supported Inputs | Motify Help',
  },
  {
    path: 'help/export',
    component: HelpTopicPageComponent,
    data: { topic: 'export' },
    title: 'Export & Rendering | Motify Help',
  },
  {
    path: 'help/troubleshooting',
    component: HelpTopicPageComponent,
    data: { topic: 'troubleshooting' },
    title: 'Troubleshooting | Motify Help',
  },
  {
    path: 'help/availability',
    component: HelpTopicPageComponent,
    data: { topic: 'availability' },
    title: 'Feature Availability | Motify Help',
  },
  {
    path: 'help/:topic',
    component: HelpTopicPageComponent,
    title: 'Help Center | Motify',
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
  {
    path: '404',
    component: NotFoundPageComponent,
    title: 'Page Not Found | Motify',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Page Not Found | Motify',
  },
];
