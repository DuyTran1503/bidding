import { LEVELTASK } from "@/shared/enums/level";
import { IEmployee } from "../employee/employee.model";
import { IProject } from "../project/project.model";

export interface ITask {
  id: string;
  name: string;
  difficulty_level?: LEVELTASK;
  level_task?: LEVELTASK;
  code: string;
  employees?: IEmployee[];
  employee_id: number[];
  description?: string;
  project_id?: string;
  project?: IProject;
}
