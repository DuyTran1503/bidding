export interface IAttachment {
  id: string | number;
  user_id: string;
  project_id: string;
  name: string;
  file: string;
  is_active?: boolean;
}
