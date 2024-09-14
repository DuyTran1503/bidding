import { ETYPEACTIVITYLOG } from "@/shared/enums/typeActivityLog";

export interface IActivityLog {
    id: number | string;
    log_name: string;
    event?: ETYPEACTIVITYLOG;
    action_performer: string;
    description: string;
  }