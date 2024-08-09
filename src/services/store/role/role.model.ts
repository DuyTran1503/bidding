import { IPermission } from "../permission/permission.model";

export interface IRole {
  id: string;
  name: string;
  permissions: IPermission[];
}
export interface IUpdateRole {
  id_permission_checked: number[];
  permissions: IPermission[];
  name?: string;
  role: {
    id?: string;
    name: string;
  };
}
