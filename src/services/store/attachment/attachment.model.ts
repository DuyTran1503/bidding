import { IProject } from "../project/project.model";

export interface IAttachment {
  id: string | number;
  user_id: string;
  project_id: string;
  project: IProject;
  name: string;
  path: File | string;
  is_active?: boolean;
}
