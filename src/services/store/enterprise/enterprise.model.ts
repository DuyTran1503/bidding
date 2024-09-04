export interface IEnterprise {
  id: string | number;
  name: string;
  address: string;
  representative: string;
  phone: string;
  email: string;
  avatar: File;
  taxcode?: string;
  account_ban_at: string | null;
  website?: string;
  join_date?: string;
  industry_id?: number[];
  description?: string;
  establish_date?: string;
  organization_type?: string | number;
  avg_document_rating?: string;
  registration_date?: string;
  registration_number?: string;
  is_active?: number;
  is_blacklist?: number;
  password?: string;
}
