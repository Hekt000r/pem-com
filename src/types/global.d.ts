import { ObjectId } from "mongodb";

// types/global.d.ts
declare global {
  export interface Company {
    name: string;
    displayName: string;
    imgURL: string;
    _id: ObjectId;
    Admins: ObjectId[];
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
  }

  export interface AdminProps {
    BillingData: BillingData;
  }

  export interface Conversation {
    _id: string;
    participants: Array<ObjectId>;
  }

  export type ConversationMembersNames = Record<string, { image?: string; name?: string }>;
  export type ConversationMembersProfiles = Record<string, { firstName: string; surname: string }>

  export interface Message {
    _id: string;
    content: string;
    conversationId: string;
    senderId : string;
    timestap: Date;
  }

}

export {};
