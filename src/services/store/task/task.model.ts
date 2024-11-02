import { LEVELTASK } from "@/shared/enums/level";

export interface ITask {
  id: string;
  name: string;
  difficulty_level?: LEVELTASK;
  code: string;
  employees?: { id: string; name: string }[];
  employee_id: number[];
  document?: File;
}
