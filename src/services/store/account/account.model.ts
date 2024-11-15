import { ETYPESTAFF } from "@/shared/enums/typeStaff";

export interface IStaff {
  id: number;
  role_ids: number[];
  role_name?: string;
  code_staff?: string | null;
  name: string;
  password: string;
  avatar?: string;
  email: string;
  phone: string;
  total_bought?: number | null;
  type?: ETYPESTAFF;
  account_ban_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
