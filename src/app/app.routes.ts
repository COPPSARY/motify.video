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
import { SolutionPageComponent } from './features/solutions/solution-page.component';
import { ComparisonPageComponent } from './features/compare/comparison-page.component';

const loadLegalPage = () =>
  import('./features/legal/legal-page.component').then((module) => module.LegalPageComponent);

const loadBlogIndexPage = () =>
  import('./features/blog/blog-index-page.component').then((module) => module.BlogIndexPageComponent);

const loadBlogArticlePage = () =>
  import('./features/blog/blog-article-page.component').then((module) => module.BlogArticlePageComponent);

const loadStoryboardResourcePage = () =>
  import('./features/resources/storyboard-resource-page.component').then(
    (module) => module.StoryboardResourcePageComponent,
  );

const blogArticleRoutes: Routes = [
  ['best-ai-video-tools-product-hunt-launch', 'AI Video Tools for Product Hunt Launches (2026) | Motify'],
  ['best-ai-video-generators-product-launches', 'AI Video Generators for Product Launches (2026) | Motify'],
  ['product-hunt-launch-checklist', 'Product Hunt Launch Checklist: Complete 2026 Guide | Motify'],
  ['product-launch-video-script-templates', '7 Product Launch Video Scripts You Can Copy | Motify'],
  ['scale-saas-content-engine-ai-video', 'Build a Scalable SaaS AI Video Content Engine | Motify'],
  ['landing-page-video-conversion-patterns', '5 Landing Page Video Patterns for Better Conversion | Motify'],
  ['saas-video-marketing-trends-2026', 'SaaS Video Marketing Trends That Matter in 2026 | Motify'],
  ['make-product-launch-video-that-converts', 'How to Make a Product Launch Video That Converts | Motify'],
  ['best-ai-tools-saas-explainer-videos', 'Best AI Tools for SaaS Explainer Videos (2026) | Motify'],
  ['create-app-launch-video-without-editing-skills', 'Create an App Launch Video Without Editing Skills | Motify'],
].map(([slug, title]) => ({
  path: `blog/${slug}`,
  loadComponent: loadBlogArticlePage,
  data: { slug },
  title,
}));

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
    path: 'ai-saas-launch-video-generator',
    component: SolutionPageComponent,
    data: { solution: 'saas-launch' },
    title: 'AI SaaS Launch Video Generator | Motify',
  },
  {
    path: 'ai-motion-graphics-generator',
    component: SolutionPageComponent,
    data: { solution: 'motion-graphics' },
    title: 'AI Motion Graphics Generator | Motify',
  },
  {
    path: 'software-product-video-generator',
    component: SolutionPageComponent,
    data: { solution: 'software-product' },
    title: 'AI Product Video Generator for SaaS | Motify',
  },
  {
    path: 'canvas-ai-video-editor',
    component: SolutionPageComponent,
    data: { solution: 'canvas-editor' },
    title: 'Canvas-Based AI Video Editor | Motify',
  },
  {
    path: 'compare/after-effects',
    component: ComparisonPageComponent,
    data: { comparison: 'after-effects' },
    title: 'Motify vs After Effects for Product Videos',
  },
  {
    path: 'compare/canva',
    component: ComparisonPageComponent,
    data: { comparison: 'canva' },
    title: 'Motify vs Canva AI Video for SaaS Teams',
  },
  {
    path: 'compare/synthesia',
    component: ComparisonPageComponent,
    data: { comparison: 'synthesia' },
    title: 'Motify vs Synthesia for Product Videos',
  },
  {
    path: 'compare/video-agency',
    component: ComparisonPageComponent,
    data: { comparison: 'video-agency' },
    title: 'Motify vs a Video Agency for Product Launches',
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
    path: 'resources/storyboard-generator',
    loadComponent: loadStoryboardResourcePage,
    title: 'AI Storyboard Generator for Product Videos | Motify',
  },
  {
    path: 'blog',
    loadComponent: loadBlogIndexPage,
    title: 'SaaS Video Marketing Blog | Motify',
  },
  ...blogArticleRoutes,
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
