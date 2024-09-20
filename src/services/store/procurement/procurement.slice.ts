import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusProcurement,
  createProcurement,
  deleteProcurement,
  getAllProcurements,
  getProcurementById,
  getListProcurement,
  updateProcurement,
} from "./procurement.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IProcurement } from "./procurement.model";

export interface IProcurementInitialState extends IInitialState {
  procurements: IProcurement[];
  procurement?: IProcurement | any;
  listProcurement: IProcurement[];
}

const initialState: IProcurementInitialState = {
  status: EFetchStatus.IDLE,
  procurements: [],
  listProcurement: [],
  procurement: undefined,
  message: "",
  error: undefined,
  filter: {
    size: 10,
    page: 1,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const procurementSlice = createSlice({
  name: "procurement",
  initialState,
  reducers: {
    ...commonStaticReducers<IProcurementInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllProcurements.fulfilled, (state, { payload }: PayloadAction<IResponse<IProcurement[]> | any>) => {
        if (payload.data) {
          state.Procurements = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllProcurements.rejected, (state, { payload }: PayloadAction<IResponse<IProcurement[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(getProcurementById.fulfilled, (state, { payload }: PayloadAction<IProcurement[]> | any) => {
        state.Procurement = payload.data;
        state.loading = false;
      })
      .addCase(getProcurementById.rejected, (state, { payload }: PayloadAction<IProcurement> | any) => {
        state.Procurement = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createProcurement.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createProcurement.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createProcurement.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateProcurement.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateProcurement.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateProcurement.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // change
    builder
      .addCase(changeStatusProcurement.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusProcurement.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Trạng thái hoạt động của nguồn tài trợ đã được cập nhật thành công";
      })
      .addCase(changeStatusProcurement.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteProcurement.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteProcurement.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.procurements.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteProcurement.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(getListProcurement.fulfilled, (state, { payload }: PayloadAction<IResponse<IProcurement[]> | any>) => {
        if (payload.data) {
          state.listProcurement = payload.data;
        }
      })
      .addCase(getListProcurement.rejected, (state, { payload }: PayloadAction<IResponse<IProcurement[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter, fetching, resetMessageError } = procurementSlice.actions;
export { procurementSlice };
