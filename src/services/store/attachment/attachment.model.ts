export interface IAttachment {
  id: string | number;
  user_id: string;
  project_id: string;
  name: string;
  path: File | string;
  is_active?: boolean;
}
