export type Role = "member" | "coach" | "reception" | "admin";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  role: Role;
  /** Staff only: the coach id used on class slots. */
  coachId?: string;
  createdAt: string;
  isDemoAccount?: boolean;
}

export type PlanKind = "unlimited" | "pack" | "pass";

export interface Plan {
  id: string;
  name: string;
  kind: PlanKind;
  /** Credits granted when the plan is activated. Unlimited plans use none. */
  credits: number;
  durationDays: number;
  blurb: string;
  /** Placeholder price in COP, used by payments and reports. */
  priceCop: number;
}

export type MembershipStatus = "active" | "pending" | "expired" | "cancelled";

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  status: MembershipStatus;
  startsAt: string;
  endsAt: string;
}

/** Append-only. The balance is derived from the entries, never stored. */
export interface LedgerEntry {
  id: string;
  memberId: string;
  delta: number;
  reason: "plan" | "booking" | "refund" | "manual";
  refId?: string;
  note?: string;
  at: string;
}

export interface ClassType {
  id: string;
  name: string;
  color: string;
  blurb: string;
  partner?: string;
}

export interface Coach {
  id: string;
  name: string;
}

export interface ClassTemplate {
  id: string;
  classTypeId: string;
  /** 0 = Sunday ... 6 = Saturday */
  weekday: number;
  time: string;
  durationMin: number;
  capacity: number;
  coachId: string;
}

export interface Slot {
  id: string;
  templateId?: string;
  classTypeId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  coachId: string;
  status: "scheduled" | "cancelled";
}

export type BookingStatus = "booked" | "cancelled" | "attended" | "no_show";

export interface Booking {
  id: string;
  slotId: string;
  memberId: string;
  status: BookingStatus;
  creditCost: number;
  createdAt: string;
  cancelledAt?: string;
  checkedInAt?: string;
}

export interface WaitlistEntry {
  id: string;
  slotId: string;
  memberId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  memberId: string;
  kind: "booking" | "waitlist" | "cancel" | "payment" | "credits" | "renewal" | "reminder" | "system";
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
  /** Lets jobs avoid sending the same notice twice. */
  refId?: string;
}

export interface Payment {
  id: string;
  memberId: string;
  planId: string;
  amountCop: number;
  method: "bold" | "cash" | "transfer";
  status: "approved" | "declined";
  at: string;
  receiptNo: string;
}

export interface Contract {
  memberId: string;
  signedAt: string;
  /** PNG data URL of the handwritten signature. */
  signature: string;
}

export interface Db {
  profiles: Profile[];
  memberships: Membership[];
  ledger: LedgerEntry[];
  templates: ClassTemplate[];
  slots: Slot[];
  bookings: Booking[];
  waitlist: WaitlistEntry[];
  notifications: Notification[];
  payments: Payment[];
  contracts: Contract[];
  seq: number;
  slotsGeneratedUntil: string;
}

export class DomainError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message);
  }
}
