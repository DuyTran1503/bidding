export interface IActivityLog {
    id: number | string;
    log_name: string;
    event: string;
    action_performer: string;
    descripton: string;
    subject_type: string;
    start_date: Date;
    address_ip: string;
    user_agent?: string;
    
  }