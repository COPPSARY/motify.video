export interface Feature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** Icon identifier resolved by an icon component/pipe; not a raw URL. */
  readonly icon: string;
}

