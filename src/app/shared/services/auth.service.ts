import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

  get apiUrl(): string {
    return motifyApiUrl();
  }

  async currentUser(): Promise<MotifyUser | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<AuthResponse>(`${this.apiUrl}/v1/auth/me`, { withCredentials: true }),
      );
      return response.data.user;
    } catch {
      return null;
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
    return response.data.user;
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
    return window.location.origin + '/';
  }

  setPendingReturnUrl(url: string): void {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(PENDING_RETURN_KEY, url);
  }

  consumePendingReturnUrl(): string | null {
    if (typeof sessionStorage === 'undefined') return null;
    const url = sessionStorage.getItem(PENDING_RETURN_KEY);
    sessionStorage.removeItem(PENDING_RETURN_KEY);
    return url;
  }
}
