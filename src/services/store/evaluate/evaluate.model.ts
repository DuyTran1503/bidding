import { IEnterprise } from "../enterprise/enterprise.model";
import { IProject } from "../project/project.model";

export interface IEvaluate {
  id: string;
  project_id?: number;
  enterprise_id?: number;
  title: string;
  score: number;
  evaluate: string;
  project?: IProject ;
  enterprise?: IEnterprise;
}
