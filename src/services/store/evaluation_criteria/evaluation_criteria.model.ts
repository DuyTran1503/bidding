export interface IEvaluationCriteria {
  id: string | number;
  project_id: string | number;
  criteria_name: string;
  weight: string;
  description?: string;
  status: string;
}
