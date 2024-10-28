import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { ITask } from "./task.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { getAllTasks, createTask, updateTask, deleteTask, getTaskById } from "./task.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";

export interface ITaskInitialState extends IInitialState {
  tasks: ITask[];
  activeTask: ITask | undefined;
}

const initialState: ITaskInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  tasks: [],
  activeTask: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    ...commonStaticReducers<ITaskInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding types
    builder.addCase(getAllTasks.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
        state.tasks = payload.data.data;
        state.totalRecords = payload.data.total_elements;
        state.totalPages = payload.data.total_pages;
        state.pageSize = payload.data.page_size;
        state.currentPage = payload.data.current_page;
      }
    });

    // ? Get By ID
    builder.addCase(getTaskById.fulfilled, (state, { payload }: PayloadAction<IResponse<ITask> | any>) => {
      if (payload.data) {
        state.activeTask = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
      }
    });

    // ? Create bidding type
    builder
      .addCase(createTask.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createTask.fulfilled, (state, { payload }: PayloadAction<IResponse<ITask> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.tasks.push(payload.data);
        }
      })
      .addCase(createTask.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        console.log(payload?.errors);

        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding type
    builder
      .addCase(updateTask.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateTask.fulfilled, (state, { payload }: PayloadAction<IResponse<ITask> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.tasks.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.tasks[index] = payload.data;
          }
        }
      })
      .addCase(updateTask.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding type
    builder
      .addCase(deleteTask.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.tasks = state.tasks?.filter((type) => type.id !== payload);
      })
      .addCase(deleteTask.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = taskSlice.actions;
export { taskSlice };
