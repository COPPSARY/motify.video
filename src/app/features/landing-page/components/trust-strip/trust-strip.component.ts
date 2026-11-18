import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The partners that recognize and support Motify. Real names only. */
@Component({
  selector: 'app-trust-strip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="trust" aria-label="Recognized and supported by partners">
      <p class="trust__label">Recognized &amp; supported by</p>
      <div class="trust__logos">
        <a href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Google Cloud">
          <img class="trust__google" src="/assets/google-cloud-icon.svg" alt="Google Cloud" width="30" height="24" loading="lazy" />
          <strong>Google Cloud</strong>
        </a>
        <a href="https://www.datadoghq.com/partner/datadog-for-startups/" target="_blank" rel="noopener noreferrer" aria-label="Datadog for Startups">
          <img class="trust__datadog" src="/dd_logo_h_white.png" alt="Datadog" width="1600" height="393" loading="lazy" />
        </a>
        <a href="https://www.kiritts.com/?locale=en" target="_blank" rel="noopener noreferrer" aria-label="KiriTTS">
          <img src="/assets/kiritts-logo.svg" alt="" width="32" height="32" loading="lazy" />
          <strong>KiriTTS</strong>
        </a>
        <a href="https://sophat.space/" target="_blank" rel="noopener noreferrer" aria-label="sophat.space">
          <img src="/sophat.space.png" alt="" width="1024" height="1024" loading="lazy" decoding="async" />
          <strong>sophat.space</strong>
        </a>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }

    .trust {
      display: grid;
      justify-items: center;
      gap: 1.6rem;
      width: min(72rem, calc(100% - 3rem));
      margin: 0 auto;
      padding-block: clamp(3.5rem, 7vw, 5.5rem) 0;
      text-align: center;
    }

    .trust__label {
      margin: 0;
      color: var(--motify-text-quiet);
      font-size: 0.78rem;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .trust__logos {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1.25rem clamp(2rem, 5vw, 4rem);
    }

    .trust__logos a {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      color: var(--motify-text-primary);
      text-decoration: none;
      opacity: 0.62;
      filter: grayscale(1);
      transition: opacity 240ms ease, filter 240ms ease;
    }

    .trust__logos a:hover,
    .trust__logos a:focus-visible {
      opacity: 1;
      filter: none;
      outline: none;
    }

    .trust__logos img {
      display: block;
      width: 1.75rem;
      height: 1.75rem;
      object-fit: contain;
    }

    .trust__logos .trust__google { width: 2.1rem; }
    .trust__logos .trust__datadog { width: 6.2rem; height: auto; }

    .trust__logos strong {
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    @media (max-width: 620px) {
      .trust { width: calc(100% - 2rem); }
      .trust__logos { gap: 1rem 1.6rem; }
      .trust__logos img { width: 1.5rem; height: 1.5rem; }
      .trust__logos .trust__datadog { width: 5.2rem; }
      .trust__logos strong { font-size: 0.85rem; }
    }
  `,
})
export class TrustStripComponent {}
