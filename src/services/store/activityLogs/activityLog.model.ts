import { E_TYPE_ACTIVITY } from "@/shared/enums/typeActivityLog";

export interface IActivityLog {
  id: number | string;
  log_name: string;
  event?: E_TYPE_ACTIVITY;
  action_performer: string;
  description: string;
}
