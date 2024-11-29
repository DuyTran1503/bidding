import { IProject } from "../project/project.model";

export interface IEvaluationCriteria {
  id: string;
  project_id?: string;
  project_name?: string;
  project?: IProject|IProject[];
  name: string;
  weight: string;
  description?: string;
  is_active: string;
}
