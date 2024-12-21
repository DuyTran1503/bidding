import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { EPermissions } from "../enums/permissions";
import { checkPermission } from "@/helpers/checkPermission";

/**
 * Kiểm tra quyền người dùng.
 * @param permission - Quyền cần kiểm tra.
 * @returns {boolean} - `true` nếu có quyền, `false` nếu không.
 */
const hasPermissionSys = (permission: EPermissions): boolean => {
  const { state } = useArchive<IAuthInitialState>("auth");
  return checkPermission(state?.profile?.permissions, permission);
};

// Ví dụ sử dụng:
