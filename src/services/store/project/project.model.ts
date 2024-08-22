 export interface IProject {
  id: number|string;
  parent_id?: number |string;
  children?: IProject[] | null;
  name: string;
  bidding_field_id: number |string;
  staff_id?: number |string;
  release_date: string;
  decision_issuance: string;
  owner_representative: string;
  tenderer_representative: string;
  location: string;
  funding_source_id: number|string;
  tender_package_price: number;
  description: string;
  invest_total: number;
  tender_date: string;
  enterprise_id: number;
  technical_requirements: string;
  status?: string;
  start_time?: string;
  end_time?: string;
}