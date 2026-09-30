import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { motifyApiUrl } from '../config/runtime-config';

export type PlanId = 'starter' | 'pro' | 'studio';
export type PaymentStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
export type SubscriptionStatus = 'none' | 'active' | 'expired';

export interface BillingPlan {
  readonly id: PlanId;
  readonly name: string;
  readonly price: number;
  readonly currency: 'USD';
  readonly periodDays: number;
  readonly credits: number;
  readonly available: boolean;
}

export interface MotifyWorkspace {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly kind: 'personal' | 'team';
  readonly role: 'owner' | 'editor' | 'viewer';
}

export interface WorkspaceSubscription {
  readonly status: SubscriptionStatus;
  readonly plan: PlanId | null;
  readonly currentPeriodStart: string | null;
  readonly currentPeriodEnd: string | null;
}

export interface BillingPayment {
  readonly id: string;
  readonly workspaceId: string;
  readonly plan: PlanId;
  readonly amount: number;
  readonly currency: 'USD' | 'KHR';
  readonly billNumber: string;
  readonly status: PaymentStatus;
  readonly qr: string | null;
  readonly expiresAt: string;
  readonly paidAt: string | null;
  readonly createdAt: string;
  readonly subscription?: WorkspaceSubscription | null;
}

interface DataResponse<T> {
  readonly data: T;
}

@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);

  readonly subscription = signal<WorkspaceSubscription | null>(null);

  private get apiUrl(): string {
    return motifyApiUrl();
  }

  listPlans(): Promise<readonly BillingPlan[]> {
    return this.get<readonly BillingPlan[]>('/v1/billing/plans', false);
  }

  listWorkspaces(): Promise<readonly MotifyWorkspace[]> {
    return this.get<readonly MotifyWorkspace[]>('/v1/workspaces');
  }

  async getSubscription(workspaceId: string): Promise<WorkspaceSubscription> {
    const subscription = await this.get<WorkspaceSubscription>(`/v1/workspaces/${workspaceId}/billing/subscription`);
    this.subscription.set(subscription);
    return subscription;
  }

  async createCheckout(
    workspaceId: string,
    plan: PlanId,
    csrfToken: string,
  ): Promise<BillingPayment> {
    const response = await firstValueFrom(
      this.http.post<DataResponse<BillingPayment>>(
        `${this.apiUrl}/v1/workspaces/${workspaceId}/billing/payments`,
        { plan },
        {
          withCredentials: true,
          headers: new HttpHeaders({ 'X-CSRF-Token': csrfToken }),
        },
      ),
    );
    return response.data;
  }

  async getPayment(paymentId: string): Promise<BillingPayment> {
    const payment = await this.get<BillingPayment>(`/v1/payments/${paymentId}`);
    if (payment.subscription) this.subscription.set(payment.subscription);
    return payment;
  }

  clearSubscription(): void {
    this.subscription.set(null);
  }

  private async get<T>(path: string, withCredentials = true): Promise<T> {
    const response = await firstValueFrom(
      this.http.get<DataResponse<T>>(`${this.apiUrl}${path}`, { withCredentials }),
    );
    return response.data;
  }
}
