export interface IChartEnterprise {
  id: string;
  enterprise: string;
  enterprise_name: string;
  employee_name: string;
  salaryAvg: number;
  numberProjectWinning: number;
  averageWinningAmount: number;
  totalWinningAmount: number;
  tendererProjectCount: number;
  investorProjectCount: number;
  difficulty_label: string;
  quantityEmployee: number;
  average_difficulty: number;
  average_feedback: number;
  feedback_label: string;
  year: number;
  monthly_data: {
    month: number;
    completed_projects?: number;
    won_projects?: number;
  }[];
  user_id: number;
  industry_id: string[];
  name: string;
  email: string;
  taxcode: number;
  account_ban_at: string | null;
  representative: string;
  avatar: string;
  phone: string; 
  address: string; 
  website: string; 
  description: string | null;
  establish_date: string;
  avg_document_rating: string; 
  registration_date: string; 
  registration_number: string; 
  organization_type: string;
  reputation: number; 
  is_active: number; 
  is_blacklist: number;
  created_at: string;
  updated_at: string; 
}
export interface INumberOfEmployeeEnterprise {
  enterprise: string;
  quantityEmployee: number;
}
