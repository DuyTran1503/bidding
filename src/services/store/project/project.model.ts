import { STATUS_PROJECT } from "@/shared/enums/statusProject";

export interface IProject {
  id: number | string;
  parent_id?: number | string;
  children?: IProject[] | null;
  name: string;
  bidding_field_id: number | string;
  staff_id?: number | string;
  selection_method_id?: number | string;
  release_date: Date | string;
  decision_issuance: string;
  owner_representative: string;
  tenderer_representative: string;
  location: string;
  funding_source_id: number | string;
  tender_package_price: number;
  description: string;
  submission_deadline: Date | string;
  invest_total: number;
  tender_date: Date | string;
  enterprise_id: number | string;
  technical_requirements: string;
  attached_documents?: string;
  end_bidding?: Date | string;
  start_bidding?: Date | string;
  location_bidding?: string;
  start_time?: Date | string;
  end_time?: Date | string;
  status?: STATUS_PROJECT;
}
