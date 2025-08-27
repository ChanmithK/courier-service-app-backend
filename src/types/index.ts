import type { Request } from "express";

export interface User {
  id: number;
  email: string;
  password: string;
  company_name: string | null;
  contact_name: string;
  address: string;
  phone_number: string | null;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  user_id: number;
  sender_name: string;
  sender_address: string;
  recipient_name: string;
  recipient_address: string;
  package_description: string | null;
  package_weight: number | null;
  package_dimensions: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    is_admin: boolean;
  };
}
