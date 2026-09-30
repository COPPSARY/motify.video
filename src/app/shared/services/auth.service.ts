import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { motifyApiUrl } from '../config/runtime-config';

export interface MotifyUser {
  readonly id: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly displayName: string;
  readonly avatarUrl: string | null;
}

interface AuthResponse {
  readonly data: {
    readonly user: MotifyUser;
    readonly csrfToken: string;
  };
}

const PENDING_RETURN_KEY = 'motify-pending-return-url';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private csrfTokenValue: string | null = null;
  private currentUserRequest: Promise<MotifyUser | null> | null = null;

  readonly user = signal<MotifyUser | null>(null);
  readonly sessionResolved = signal(false);

  get apiUrl(): string {
    return motifyApiUrl();
  }

  currentUser(): Promise<MotifyUser | null> {
    if (this.sessionResolved()) return Promise.resolve(this.user());
    if (this.currentUserRequest) return this.currentUserRequest;

    this.currentUserRequest = this.fetchCurrentUser();
    return this.currentUserRequest;
  }

  private async fetchCurrentUser(): Promise<MotifyUser | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<AuthResponse>(`${this.apiUrl}/v1/auth/me`, { withCredentials: true }),
      );
      this.csrfTokenValue = response.data.csrfToken;
      this.user.set(response.data.user);
      return this.user();
    } catch {
      this.csrfTokenValue = null;
      this.user.set(null);
      return null;
    } finally {
      this.sessionResolved.set(true);
      this.currentUserRequest = null;
    }
  }

  async login(email: string, password: string): Promise<MotifyUser> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.apiUrl}/v1/auth/login`,
        { email, password },
        { withCredentials: true },
      ),
    );
    this.csrfTokenValue = response.data.csrfToken;
    this.user.set(response.data.user);
    this.sessionResolved.set(true);
    return response.data.user;
  }

  async logout(): Promise<void> {
    if (!this.csrfTokenValue) throw new Error('Cannot log out without an active session.');
    await firstValueFrom(
      this.http.post<void>(
        `${this.apiUrl}/v1/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: { 'X-CSRF-Token': this.csrfTokenValue },
        },
      ),
    );
    this.csrfTokenValue = null;
    this.user.set(null);
    this.sessionResolved.set(true);
  }

  csrfToken(): string | null {
    return this.csrfTokenValue;
  }

  /**
   * Creates the account. The API answers 202 and mails a verification link, so
   * there is no session yet: the user signs in by following that link.
   */
  async signUp(email: string, password: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${this.apiUrl}/v1/auth/sign-up`,
        { email, password, returnTo: this.returnToUrl() },
        { withCredentials: true },
      ),
    );
  }

  googleLoginUrl(): string {
    const url = new URL(`${this.apiUrl}/v1/auth/google`);
    const returnTo = this.returnToUrl();
    if (returnTo) url.searchParams.set('returnTo', returnTo);
    return url.toString();
  }

  /**
   * Where the API sends the browser once the round trip finishes. The site and
   * the editor are separate front ends, so a login has to say which one it
   * started from or it lands on the wrong one.
   */
  private returnToUrl(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const pendingReturnUrl = sessionStorage.getItem(PENDING_RETURN_KEY);
    if (!isSafeReturnPath(pendingReturnUrl)) return window.location.origin + '/';

    const url = new URL('/login', window.location.origin);
    url.searchParams.set('returnUrl', pendingReturnUrl);
    return url.toString();
  }

  setPendingReturnUrl(url: string): void {
    if (typeof sessionStorage !== 'undefined' && isSafeReturnPath(url)) {
      sessionStorage.setItem(PENDING_RETURN_KEY, url);
    }
  }

  consumePendingReturnUrl(): string | null {
    if (typeof sessionStorage === 'undefined') return null;
    const url = sessionStorage.getItem(PENDING_RETURN_KEY);
    sessionStorage.removeItem(PENDING_RETURN_KEY);
    return url;
  }
}

function isSafeReturnPath(value: string | null | undefined): value is string {
  return Boolean(value?.startsWith('/') && !value.startsWith('//'));
}
