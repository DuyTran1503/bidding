import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import { IProject } from "../project/project.model";
import { getProjectApprovalByStaff } from "./project-approval.thunk";

export interface IProjectApprovalState extends IInitialState {
  projectApprovals: IProject[];
}

const initialState: IProjectApprovalState = {
  status: EFetchStatus.IDLE,
  message: "",
  projectApprovals: [],
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

const projectApprovalSlice = createSlice({
  name: "project_approval",
  initialState,
  reducers: {
    ...commonStaticReducers<IProjectApprovalState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding types
    builder
      .addCase(getProjectApprovalByStaff.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
        if (payload.data) {
          state.projectApprovals = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
        }
      })
      .addCase(getProjectApprovalByStaff.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload.message);
      });
  },
});

export const { resetStatus, setFilter } = projectApprovalSlice.actions;
export { projectApprovalSlice };
