import { commonStaticReducers } from "@/services/shared";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRole, deleteRole, getAllPermissions, getAllRoles, getRoleById, updateRole } from "./role.thunk";
import { IRole, IUpdateRole } from "./role.model";
import { IPermission } from "../permission/permission.model";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";

export interface IRoleInitialState extends IInitialState {
  roles: IRole[];
  activeRole: IUpdateRole | undefined;
  permissions: IPermission[];
}

const initialState: IRoleInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  roles: [],
  permissions: [],
  activeRole: undefined,
  totalRecords: 0,
  loading: false,
  filter: {
    size: 10,
    page: 1,
  },
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    ...commonStaticReducers<IRoleInitialState>(),
    setData: (state) => {
      state.permissions = [];
    },
    fetching(state) {
      state.loading = true;
    },
  },
  extraReducers(builder) {
    // ? Get all roles
    builder
      .addCase(getAllRoles.fulfilled, (state, { payload }: PayloadAction<IResponse<IRole[]> | any>) => {
        // state.status = EFetchStatus.FULFILLED;
        if (payload.data) {
          state.roles = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
        }
      })
      .addCase(getAllRoles.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Get role by id
    builder
      .addCase(getRoleById.pending, (state) => {
        // state.status = EFetchStatus.PENDING;
        state.loading = true;
      })
      .addCase(getRoleById.fulfilled, (state, { payload }: PayloadAction<IUpdateRole> | any) => {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { permissions, created_at, guard_name, ...rest } = payload.role;
        state.activeRole = {
          permissions: payload?.id_permission_checked,
          ...rest,
        };

        state.loading = false;
      })
      .addCase(getRoleById.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Create role
    builder
      .addCase(createRole.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới vai trò thành công";
      })
      .addCase(createRole.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update role
    builder
      .addCase(updateRole.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật vai trò thành công";
      })
      .addCase(updateRole.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete role
    builder
      .addCase(deleteRole.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa vai trò thành công";
        state.roles = state.roles.filter((role) => role.id !== payload);
      })
      .addCase(deleteRole.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder.addCase(getAllPermissions.fulfilled, (state, { payload }: PayloadAction<IResponse<IPermission[]> | any>) => {
      if (payload) {
        state.permissions = payload.permissions.data;
      }
    });
  },
});

export const { resetStatus, setFilter, setData, fetching } = roleSlice.actions;
export { roleSlice };
