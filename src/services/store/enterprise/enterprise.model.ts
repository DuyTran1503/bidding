export interface IEnterprise {
  id: string | number;
  name: string;
  address: string;
  representative: string;
  phone: string;
  email: string;
  avatar?: string;
  taxcode?: string;
  account_ban_at?: string | null;
  website?: string;
  join_date?: string;
  industries: { id: number; name: string }[];
  description?: string;
  establish_date?: string;
  organization_type?: string | number;
  avg_document_rating?: string;
  registration_date?: string;
  registration_number?: string;
  is_active?: boolean;
  is_blacklist?: boolean;
  password?: string;
}
