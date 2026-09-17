import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { EXTERNAL_LINKS } from '../constants/external-links';
import { parseGithubRepo } from '../utils/github-repo';

interface GithubRepoResponse {
  readonly stargazers_count?: number;
}

/**
 * Fetches and caches the live GitHub star count for the Motify repository
 * (parsed from `EXTERNAL_LINKS.github`) via the public GitHub REST API.
 *
 * Fails silently: on error, on a non-numeric response, or when the repo URL
 * cannot be parsed, `stars()` simply stays `null` so callers can hide the
 * star count UI instead of showing a broken/zero value.
 */
@Injectable({ providedIn: 'root' })
export class GithubStarsService {
  private readonly http = inject(HttpClient);
  private readonly repo = parseGithubRepo(EXTERNAL_LINKS.github);

  private readonly starsSignal = signal<number | null>(null);
  private loaded = false;

  /** The last-fetched star count, or `null` if not yet loaded / unavailable. */
  readonly stars = this.starsSignal.asReadonly();

  /**
   * Triggers the (at most once) fetch of the star count. Safe to call from
   * multiple components; subsequent calls are no-ops once a request has been
   * issued.
   */
  load(): void {
    if (this.loaded || !this.repo) {
      return;
    }
    this.loaded = true;

    this.http
      .get<GithubRepoResponse>(`https://api.github.com/repos/${this.repo.owner}/${this.repo.name}`)
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        const count = response?.stargazers_count;
        if (typeof count === 'number' && Number.isFinite(count)) {
          this.starsSignal.set(count);
        }
      });
  }
}
