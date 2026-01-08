import { ObjectId } from "mongodb";

// types/global.d.ts
declare global {

  /* Company related stuff */

  export enum CompanyStatus {
    PENDING = "PENDING",
    ACTION_REQUIRED = "ACTION_REQUIRED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    AWAITING_VERIFICATION = "AWAITING_VERIFICATION"
  }

  export type CompanyVerificationMagicLink = {
    _id: ObjectId;
    token: string;
    companyId: ObjectId;
    expiresAt: Date;
  }

  export type CompanyRepresentative = {
    position: string,
    email: string,
    repName: string
  }

  export type CompanyLifecycle = {
    submittedAt: Date,
    lastReviewedAt: Date,
    activatedAt: Date
  }

  export type UserRole = "owner" | "admin" // user role in company

  export interface CompanyUser {
    userId: ObjectId;
    role: UserRole;
  }

  export interface Company {
    name: string;
    displayName: string;
    industry: string;
    description: string;
    site: string;
    imgURL: string;
    _id: ObjectId;
    Admins: ObjectId[];
    users: CompanyUser[];
    status: CompanyStatus;
    adminNotes: string;
    expireAt?: Date;
    lifecycle: CompanyLifecycle
    representative?: CompanyRepresentative;
    location: string;
  }

  export interface BillingPlanInfo {
    displayName: string;
    maxAdmins: number;
    maxPosts: number;
    maxMessages: number;
    maxAds: number;
  }

  export interface CompanyBillingInfo {
    admins: number;
    posts: number;
    messages: number;
    ads: number;
  }

  export interface BillingData {
    BillingPlanInfo: BillingPlanInfo;
    CompanyBillingInfo: CompanyBillingInfo;
  }

  export interface Admin {
    profile: {
      firstName: string;
      surname: string;
    };
    user: {
      email: string;
    };
  }

  export interface User {
    _id: ObjectId;
    oauthId: string;
    email: string;
    name: string;
    image: string;
    token: JWT;
    hasProfile: boolean;
  }

  export type SafeUser = {
    _id: string;
    name: string;
    email: string;
    image: string;
    hasProfile: boolean;
    oauthId: string;
  };

  export interface UserProfile {
    email: string;
    firstName: string;
    surname: string;
  }

  export interface AdminProps {
    BillingData: BillingData;
  }

  export interface Conversation {
    _id: string;
    participants: Array<ObjectId>;
  }

  export type ConversationMembersNames = Record<
    string,
    { image?: string; name?: string }
  >;
  export type ConversationMembersProfiles = Record<
    string,
    { firstName: string; surname: string }
  >;

  export interface Message {
    _id: string;
    content: string;
    conversationId: string;
    senderId: string;
    timestap: Date;
  }

  export interface CustomDecodedToken {
    oauthId: string;
  }


}

export {};
