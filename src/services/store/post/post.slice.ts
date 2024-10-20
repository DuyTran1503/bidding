import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IPost } from "./post.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  getPostById, 
  changeStatusPost 
} from "./post.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';

export interface IPostInitialState extends IInitialState {
  posts: IPost[];
  activePost: IPost | any;
}

const initialState: IPostInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  posts: [],
  activePost: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    ...commonStaticReducers<IPostInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all Posts
    builder.addCase(getAllPosts.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.posts = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getPostById.fulfilled, (state, { payload }: PayloadAction<IResponse<IPost> | any>) => {
        if (payload.data) {
          state.activePost = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create Post
    builder
      .addCase(createPost.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createPost.fulfilled, (state, { payload }: PayloadAction<IResponse<IPost> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.posts.push(payload.data);
        }
      })
      .addCase(createPost.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update Post
    builder
      .addCase(updatePost.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updatePost.fulfilled, (state, { payload }: PayloadAction<IResponse<IPost> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.posts.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.posts[index] = payload.data;
          }
        }
      })
      .addCase(updatePost.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete Post
    builder
      .addCase(deletePost.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deletePost.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.posts = state.posts?.filter((type) => type.id !== payload);
      })
      .addCase(deletePost.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      builder
      .addCase(changeStatusPost.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusPost.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusPost.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = postSlice.actions;
export { postSlice };
