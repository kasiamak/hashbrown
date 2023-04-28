// Copyright 2023 the Deno authors. All rights reserved. MIT license.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          is_subscribed: boolean;
          stripe_customer_id: string;
          user_id: string;
        };
        Insert: {
          is_subscribed?: boolean;
          stripe_customer_id: string;
          user_id?: string;
        };
        Update: {
          is_subscribed?: boolean;
          stripe_customer_id?: string;
          user_id?: string;
        };
      };
      todos: {
        Row: {
          id: string;
          name: string | null;
          user_id: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          user_id?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          user_id?: string;
        };
      };
      hashtags: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
        };
      };
      hashtag_group: {
        Row: {
          id?: string;
          name: string | null;
          user_id: string;
          hashtags?: string[];
        };
        Insert: {
          id?: string;
          name?: string | null;
          user_id?: string;
          hashtags?: string[];
        };
        Update: {
          id?: string;
          name?: string | null;
          user_id?: string;
          hashtags?: string[];
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
