import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBanner } from "./banner.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  getBannerById, 
  changeStatusBanner 
} from "./banner.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';

export interface IBannerInitialState extends IInitialState {
  banners: IBanner[];
  activeBanner: IBanner | undefined;
}

const initialState: IBannerInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  banners: [],
  activeBanner: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    ...commonStaticReducers<IBannerInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding types
    builder.addCase(getAllBanners.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.banners = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getBannerById.fulfilled, (state, { payload }: PayloadAction<IResponse<IBanner> | any>) => {
        if (payload.data) {
          state.activeBanner = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create bidding type
    builder
      .addCase(createBanner.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBanner.fulfilled, (state, { payload }: PayloadAction<IResponse<IBanner> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.banners.push(payload.data);
        }
      })
      .addCase(createBanner.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding type
    builder
      .addCase(updateBanner.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBanner.fulfilled, (state, { payload }: PayloadAction<IResponse<IBanner> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.banners.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.banners[index] = payload.data;
          }
        }
      })
      .addCase(updateBanner.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding type
    builder
      .addCase(deleteBanner.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBanner.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.banners = state.banners?.filter((type) => type.id !== payload);
      })
      .addCase(deleteBanner.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      builder
      .addCase(changeStatusBanner.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBanner.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBanner.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = bannerSlice.actions;
export { bannerSlice };
