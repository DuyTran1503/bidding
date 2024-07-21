import { EPermissions } from "@/shared/enums/permissions";
import { IRole } from "../role/role.model";

export interface IUserData {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  permissions: EPermissions[];
  addressList: string[];
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  taxcode?: string;
  phone?: string;
  avatar: string;
  type: string;
  email_verified: boolean;
  permissions: EPermissions[];
  listNameRole: string[];
  roles: IRole[];
}

export interface ILoginResponseData {
  token_type: string;
  expires_in: string;
  userData: IUserData;
  access_token: string;
  refresh_token: string;
}
