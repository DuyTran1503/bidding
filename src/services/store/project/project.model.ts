export interface IEnterprise {
  id: string | number;
  name: string;
  address: string;
  representative: string;
  contact_phone: string;
  email: string;
  website?: string;
  join_date?: string;
  id_business_activity: string[];
  description?: string;
  tax_code?: string;
  organization_type?: string;
  representative_name?: string;
  business_registration_date?: string;
  business_registration_number?: string;
  is_active?: boolean;
  is_blacklisted?: boolean;
}
