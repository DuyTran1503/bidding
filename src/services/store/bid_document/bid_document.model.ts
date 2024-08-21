export interface IBidDocument {
  id: number | string;
  id_project: number;
  id_enterprise: number;
  id_bid_bond: number;
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
