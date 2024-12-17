import { LEVELTASK } from "@/shared/enums/level";
import { IEmployee } from "../employee/employee.model";

export interface ITask {
  id: string;
  name: string;
  difficulty_level?: LEVELTASK;
  code: string;
  employees?: IEmployee;
  employee_id: number[];
  document?: File;
}
