import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import {
  getAllStatisticalReports,
  createStatisticalReport,
  updateStatisticalReport,
  deleteStatisticalReport,
  getStatisticalReportById,
  changeStatusStatisticalReport,
} from "./statisticalReport.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import { IStatisticalReport } from "./statisticalReport.motel";

export interface IStatisticalReportInitialState extends IInitialState {
  statisticalReports: IStatisticalReport[];
  activeStatisticalReport: IStatisticalReport | undefined;
}

const initialState: IStatisticalReportInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  statisticalReports: [],
  activeStatisticalReport: undefined,
  totalRecords: 0, // Tổng số lượng mục
  totalPages: 0, // Tổng số trang
  pageSize: 10, // Số lượng mục trên mỗi trang
  currentPage: 1, // Trang hiện tại
  filter: {
    size: 10,
    page: 1,
  },
};

const statisticalReportSlice = createSlice({
  name: "statisticalReport",
  initialState,
  reducers: {
    ...commonStaticReducers<IStatisticalReportInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding fields
    builder
      .addCase(getAllStatisticalReports.fulfilled, (state, { payload }: PayloadAction<IResponse<IStatisticalReport[] | any>>) => {
        if (payload.data) {
          state.statisticalReports = payload.data.data;

          state.totalRecords = payload.data.total_elements; // Tổng số lượng mục
          state.totalPages = payload.data.total_pages; // Tổng số trang
          state.pageSize = payload.data.page_size; // Số lượng mục trên mỗi trang
          state.currentPage = payload.data.current_page; // Trang hiện tại
        }
      })
      .addCase(getAllStatisticalReports.rejected, (state, { payload }: PayloadAction<any>) => {
        if (payload) {
          state.status = EFetchStatus.REJECTED;
          state.message = transformPayloadErrors(payload?.errors);
        }
      });
    builder
      .addCase(getStatisticalReportById.fulfilled, (state, { payload }: PayloadAction<IResponse<IStatisticalReport> | any>) => {
        if (payload.data) {
          state.activeStatisticalReport = payload.data;
        }
      })
      .addCase(getStatisticalReportById.rejected, (state, { payload }: PayloadAction<any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });

    // ? Create bidding field
    builder
      .addCase(createStatisticalReport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createStatisticalReport.fulfilled, (state, { payload }: PayloadAction<IResponse<IStatisticalReport> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.statisticalReports.push(payload.data);
        }
      })
      .addCase(createStatisticalReport.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding field
    builder
      .addCase(updateStatisticalReport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateStatisticalReport.fulfilled, (state, { payload }: PayloadAction<IResponse<IStatisticalReport> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
        if (payload.data) {
          const index = state.statisticalReports.findIndex((field) => field.id === payload.data.id);
          if (index !== -1) {
            state.statisticalReports[index] = payload.data;
          }
        }
      })
      .addCase(updateStatisticalReport.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding field
    builder
      .addCase(deleteStatisticalReport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteStatisticalReport.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.statisticalReports = state.statisticalReports?.filter((field) => field.id !== payload);
      })
      .addCase(deleteStatisticalReport.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusStatisticalReport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusStatisticalReport.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusStatisticalReport.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = statisticalReportSlice.actions;
export { statisticalReportSlice };
