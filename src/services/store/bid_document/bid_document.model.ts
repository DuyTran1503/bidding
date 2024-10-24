export interface IBidDocument {
  id: number | string;
  project_id?: number;
  enterprise_id: number;
  bid_bond_id: number;
  submission_date?: string;
  bid_price: string;
  implementation_time?: string;
  validity_period?: string;
  technical_score?: string;
  financial_score?: string;
  totalScore?: string;
  ranking: string;
  status: string;
  notes: string;
}
