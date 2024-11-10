import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IEmployee } from "./employee.model";
import {
  changeStatusEmployee,
  createEmployee,
  deleteEmployee,
  getAllEmployee,
  getListEmployee,
  getEmployeeById,
  updateEmployee,
} from "./employee.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";

export interface IEmployeeInitialState extends IInitialState {
  employees: IEmployee[];
  employee?: IEmployee | any;
  getListEmployee: IEmployee[];
}

const initialState: IEmployeeInitialState = {
  status: EFetchStatus.IDLE,
  employees: [],
  getListEmployee: [],
  employee: undefined,
  message: "",
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 50,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    ...commonStaticReducers<IEmployeeInitialState>(),
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllEmployee.fulfilled, (state, { payload }: PayloadAction<IResponse<IEmployee[]> | any>) => {
        if (payload.data) {
          state.employees = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
        }
      })
      .addCase(getAllEmployee.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getListEmployee.fulfilled, (state, { payload }: PayloadAction<IResponse<IEmployee[]> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        if (payload.data) {
          state.getListEmployee = payload.data;
        }
      })
      .addCase(getListEmployee.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getEmployeeById.fulfilled, (state, { payload }: PayloadAction<IEmployee> | any) => {
        state.employee = { ...payload?.data, enterprise_id: payload?.data.enterprise.id };
        state.loading = false;
      })
      .addCase(getEmployeeById.rejected, (state, { payload }: PayloadAction<IError> | any) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(createEmployee.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createEmployee.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateEmployee.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateEmployee.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusEmployee.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusEmployee.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusEmployee.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteEmployee.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.employees = state.employees.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteEmployee.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { setFilter, resetStatus } = employeeSlice.actions;
export { employeeSlice };
