import { LEVELTASK } from "@/shared/enums/level";

export interface ITask {
  id: string;
  name: string;
  difficulty_level?: LEVELTASK;
  code: string;
  document?: File;
}
