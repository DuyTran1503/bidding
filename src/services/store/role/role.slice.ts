import { commonStaticReducers } from "@/services/shared";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRole, deleteRole, getAllPermissions, getAllRoles, getRoleById, updateRole } from "./role.thunk";
import { IRole } from "./role.model";
import { IPermission } from "../permission/permission.model";

export interface IRoleInitialState extends IInitialState {
  roles: IRole[];
  activeRole: IRole | undefined;
  permissions: IPermission[];
}

const initialState: IRoleInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  roles: [],
  permissions: [],
  activeRole: undefined,
  totalRecords: 0,
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
  },
  extraReducers(builder) {
    // ? Get all roles
    builder.addCase(getAllRoles.fulfilled, (state, { payload }: PayloadAction<IResponse<IRole[]> | any>) => {
      if (payload.data) {
        state.roles = payload.data.data;
      }
    });
    // ? Get role by id
    builder.addCase(getRoleById.fulfilled, (state, { payload }: PayloadAction<IResponse<IRole> | any>) => {
      console.log(payload);

      state.activeRole = payload.data.data;
    });
    // ? Create role
    builder
      .addCase(createRole.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createRole.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Created successfully";
      })
      .addCase(createRole.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    // ? Update role
    builder
      .addCase(updateRole.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Updated successfully";
      })
      .addCase(updateRole.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    // ? Delete role
    builder
      .addCase(deleteRole.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Deleted successfully";
        state.roles = state.roles.filter((role) => role.id !== payload);
      })
      .addCase(deleteRole.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder.addCase(getAllPermissions.fulfilled, (state, { payload }: PayloadAction<IResponse<IPermission[]> | any>) => {
      if (payload) {
        state.permissions = payload.permissions;
      }
    });
  },
});

export const { resetStatus, setFilter } = roleSlice.actions;
export { roleSlice };
