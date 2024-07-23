import { EPermissions } from "@/shared/enums/permissions";

export interface IPermission {
  id: string;
  name: EPermissions | string;
  module?: string;
  section: string;
}

export interface IPermissionResponseData {}
