import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IPostCatalog } from "./postCatalog.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import {
  getAllPostCatalogs,
  createPostCatalog,
  updatePostCatalog,
  deletePostCatalog,
  getPostCatalogById,
  changeStatusPostCatalog,
  getListPostCatalogs,
} from "./postCatalog.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";

export interface IPostCatalogInitialState extends IInitialState {
  postCatalogs: IPostCatalog[];
  activePostCatalog: IPostCatalog | undefined;
  listPostCatalogs: IPostCatalog[];
}

const initialState: IPostCatalogInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  postCatalogs: [],
  listPostCatalogs: [],
  activePostCatalog: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const postCatalogSlice = createSlice({
  name: "post_catalog",
  initialState,
  reducers: {
    ...commonStaticReducers<IPostCatalogInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all selection methods
    builder.addCase(getAllPostCatalogs.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
        state.postCatalogs = payload.data.data;
        state.totalRecords = payload.data.total_elements;
        state.totalPages = payload.data.total_pages;
        state.pageSize = payload.data.page_size;
        state.currentPage = payload.data.current_page;
      }
    });

    // ? Get By ID
    builder.addCase(getPostCatalogById.fulfilled, (state, { payload }: PayloadAction<IResponse<IPostCatalog> | any>) => {
      if (payload.data) {
        state.activePostCatalog = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
      }
    });
    builder.addCase(getListPostCatalogs.fulfilled, (state, { payload }: PayloadAction<IResponse<IPostCatalog[]> | any>) => {
      if (payload.data) {
        state.listPostCatalogs = payload.data.map((item: IPostCatalog) => ({ ...item, name: item.name }));
        state.message = transformPayloadErrors(payload?.errors);
      }
    });
    // ? Create selection method
    builder
      .addCase(createPostCatalog.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createPostCatalog.fulfilled, (state, { payload }: PayloadAction<IResponse<IPostCatalog> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.postCatalogs.push(payload.data);
        }
      })
      .addCase(createPostCatalog.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message || transformPayloadErrors(payload?.errors);
      });
    // ? Update selection method
    builder
      .addCase(updatePostCatalog.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updatePostCatalog.fulfilled, (state, { payload }: PayloadAction<IResponse<IPostCatalog> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.postCatalogs.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.postCatalogs[index] = payload.data;
          }
        }
      })
      .addCase(updatePostCatalog.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message || transformPayloadErrors(payload?.errors);
      });
    // ? Delete selection method
    builder
      .addCase(deletePostCatalog.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deletePostCatalog.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.postCatalogs = state.postCatalogs?.filter((type) => type.id !== payload);
      })
      .addCase(deletePostCatalog.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusPostCatalog.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusPostCatalog.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusPostCatalog.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = postCatalogSlice.actions;
export { postCatalogSlice };
