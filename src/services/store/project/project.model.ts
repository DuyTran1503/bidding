import { DOMESTIC } from "@/shared/enums/domestic";
import { STATUS_PROJECT } from "@/shared/enums/statusProject";
import { SUBMIT_METHOD } from "@/shared/enums/submissionMethod";

export interface IProject {
  id: number;
  children?: IProject[];
  funding_source_id?: number | string;
  tenderer?: string;
  investor?: string;
  staff_id?: number | string;
  industry_id?: number[];
  procurement_id?: number[];
  selection_method_id?: number | string;
  parent_id?: number | null;
  decision_number?: string;
  name: string;
  is_domestic: DOMESTIC;
  location: string;
  amount: number;
  total_amount?: number;
  description?: string;
  receiving_place: string;
  bid_submission_start: string;
  bid_submission_end: string;
  bid_opening_date: string;
  start_time: string;
  end_time: string;
  decision_number_approve: string;
  approve_at?: string;
  created_at?: string;
  status: STATUS_PROJECT;
  submission_method?: SUBMIT_METHOD;
  files?: File[];
  decision_number_issued: string;
  upload_time?: string;
}
export interface INewProject extends IProject {
  tenderer_id: number[];
  investor_id: number[];
}
