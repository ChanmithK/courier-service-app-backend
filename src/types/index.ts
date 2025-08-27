export interface User {
  id?: number;
  email: string;
  password: string;
  company_name?: string;
  contact_name: string;
  address: string;
  phone_number?: string;
  is_admin?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Shipment {
  id?: number;
  tracking_number: string;
  user_id: number;
  sender_name: string;
  sender_address: string;
  recipient_name: string;
  recipient_address: string;
  package_description?: string;
  package_weight?: number;
  package_dimensions?: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    is_admin: boolean;
  };
}
