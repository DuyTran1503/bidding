import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IProcurementCategorie } from "./procurementCategorie.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import {
  getAllProcurementCategories,
  createProcurementCategorie,
  updateProcurementCategorie,
  deleteProcurementCategorie,
  getProcurementCategorieById,
  changeStatusProcurementCategorie,
} from "./procurementCategorie.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";

export interface IProcurementCategorieInitialState extends IInitialState {
  procurementCategories: IProcurementCategorie[];
  activeProcurementCategorie: IProcurementCategorie | undefined;
}

const initialState: IProcurementCategorieInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  procurementCategories: [],
  listProcurementCategories: [],
  activeProcurementCategorie: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const procurementCategorieSlice = createSlice({
  name: "procurement_categorie",
  initialState,
  reducers: {
    ...commonStaticReducers<IProcurementCategorieInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all selection methods
    builder.addCase(getAllProcurementCategories.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
        state.procurementCategories = payload.data.data;
        state.totalRecords = payload.data.total_elements;
        state.totalPages = payload.data.total_pages;
        state.pageSize = payload.data.page_size;
        state.currentPage = payload.data.current_page;
      }
    });

    // ? Get By ID
    builder.addCase(getProcurementCategorieById.fulfilled, (state, { payload }: PayloadAction<IResponse<IProcurementCategorie> | any>) => {
      if (payload.data) {
        state.activeProcurementCategorie = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
      }
    });
    // ? Create selection method
    builder
      .addCase(createProcurementCategorie.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createProcurementCategorie.fulfilled, (state, { payload }: PayloadAction<IResponse<IProcurementCategorie> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.procurementCategories.push(payload.data);
        }
      })
      .addCase(createProcurementCategorie.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message || transformPayloadErrors(payload?.errors);
      });
    // ? Update selection method
    builder
      .addCase(updateProcurementCategorie.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateProcurementCategorie.fulfilled, (state, { payload }: PayloadAction<IResponse<IProcurementCategorie> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.procurementCategories.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.procurementCategories[index] = payload.data;
          }
        }
      })
      .addCase(updateProcurementCategorie.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message || transformPayloadErrors(payload?.errors);
      });
    // ? Delete selection method
    builder
      .addCase(deleteProcurementCategorie.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteProcurementCategorie.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.procurementCategories = state.procurementCategories?.filter((type) => type.id !== payload);
      })
      .addCase(deleteProcurementCategorie.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });

    // Đổi trạng thái
    builder
      .addCase(changeStatusProcurementCategorie.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusProcurementCategorie.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusProcurementCategorie.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = procurementCategorieSlice.actions;
export { procurementCategorieSlice };
