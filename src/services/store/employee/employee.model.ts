import { EDUCATIONLEVEL } from "@/shared/enums/level";
import { TypeEmployee } from "@/shared/enums/types";
export interface IEmployee {
  id: string;
  enterprise_id: string;
  code: string;
  avatar?: File;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  taxcode?: string;
  educational_level?: EDUCATIONLEVEL;
  start_date: string;
  end_date: string;
  salary: string;
  address: string;
  status?: TypeEmployee;
}
