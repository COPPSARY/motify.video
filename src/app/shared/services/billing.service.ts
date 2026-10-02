import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { motifyApiUrl } from '../config/runtime-config';

export type PlanId = 'starter' | 'pro' | 'studio';
export type PaymentStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
export type SubscriptionStatus = 'none' | 'active' | 'expired';
export type PaymentKind = 'PLAN' | 'CREDIT_PACK';
export type PaymentMode = 'live' | 'sandbox';
export type SandboxOutcome = 'paid' | 'failed' | 'wrong_amount' | 'expired';
export type Purchase = { readonly plan: PlanId } | { readonly creditPack: string };

export interface BillingPlan {
  readonly id: PlanId;
  readonly name: string;
  readonly price: number;
  readonly currency: 'USD';
  readonly periodDays: number;
  readonly credits: number;
  readonly available: boolean;
}

export interface CreditPack {
  readonly id: string;
  readonly price: number;
  readonly currency: 'USD';
  readonly credits: number;
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
  readonly mode: PaymentMode;
  readonly kind: PaymentKind;
  readonly plan: PlanId | null;
  readonly creditPack: string | null;
  readonly credits: number;
  readonly amount: number;
  readonly currency: 'USD' | 'KHR';
  readonly billNumber: string;
  readonly status: PaymentStatus;
  readonly qr: string | null;
  readonly expiresAt: string;
  readonly paidAt: string | null;
  readonly createdAt: string;
  readonly subscription?: WorkspaceSubscription | null;
  readonly creditBalance?: number | null;
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

  listCreditPacks(): Promise<readonly CreditPack[]> {
    return this.get<readonly CreditPack[]>('/v1/billing/credit-packs', false);
  }

  listWorkspaces(): Promise<readonly MotifyWorkspace[]> {
    return this.get<readonly MotifyWorkspace[]>('/v1/workspaces');
  }

  async getSubscription(workspaceId: string): Promise<WorkspaceSubscription> {
    const subscription = await this.get<WorkspaceSubscription>(
      `/v1/workspaces/${encodeURIComponent(workspaceId)}/billing/subscription`,
    );
    this.subscription.set(subscription);
    return subscription;
  }

  async createCheckout(
    workspaceId: string,
    purchase: Purchase,
    csrfToken: string,
  ): Promise<BillingPayment> {
    const response = await firstValueFrom(
      this.http.post<DataResponse<BillingPayment>>(
        `${this.apiUrl}/v1/workspaces/${encodeURIComponent(workspaceId)}/billing/payments`,
        purchase,
        {
          withCredentials: true,
          headers: new HttpHeaders({ 'X-CSRF-Token': csrfToken }),
        },
      ),
    );
    return response.data;
  }

  async getPayment(paymentId: string): Promise<BillingPayment> {
    const payment = await this.get<BillingPayment>(`/v1/payments/${encodeURIComponent(paymentId)}`);
    if (payment.subscription) this.subscription.set(payment.subscription);
    return payment;
  }

  async simulatePayment(
    paymentId: string,
    outcome: SandboxOutcome,
    csrfToken: string,
  ): Promise<BillingPayment> {
    const response = await firstValueFrom(
      this.http.post<DataResponse<BillingPayment>>(
        `${this.apiUrl}/v1/payments/${encodeURIComponent(paymentId)}/sandbox`,
        { outcome },
        {
          withCredentials: true,
          headers: new HttpHeaders({ 'X-CSRF-Token': csrfToken }),
        },
      ),
    );
    if (response.data.subscription) this.subscription.set(response.data.subscription);
    return response.data;
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
