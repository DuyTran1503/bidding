import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import {
  approveProject,
  changeStatusProject,
  createProject,
  deleteProject,
  getAllProject,
  getListProject,
  getProjectById,
  updateProject,
} from "./project.thunk.ts";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { INewProject, IProject } from "./project.model.ts";

export interface IProjectInitialState extends IInitialState {
  projects: IProject[];
  project?: IProject | any;
  listProjects?: IProject[];
  id_project?: string;
  dataCreateProject?: INewProject;
}
const initialState: IProjectInitialState = {
  status: EFetchStatus.IDLE,
  projects: [],
  listProjects: [],
  id_project: "",
  project: undefined,
  dataCreateProject: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    ...commonStaticReducers<IProjectInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllProject.fulfilled, (state, { payload }: PayloadAction<IResponse<IProject[]> | any>) => {
        if (payload.data) {
          state.projects = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllProject.rejected, (state, { payload }: PayloadAction<IResponse<IProject[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getProjectById.fulfilled, (state, { payload }: PayloadAction<INewProject> | any) => {
        state.project = {
          ...payload.data,
          industries: payload?.data?.industries?.map((item: any) => item.id),
          arrayIndustry: payload?.data?.industries?.map((item: any) => item.name),
          procurement_categories: payload?.data?.procurement_categories?.map((item: any) => item.id),
          procurement_category_name: payload?.data?.procurement_categories?.map((item: any) => item.name),
          funding_source: payload?.data?.funding_source?.id,
          funding_sourceName: payload?.data?.funding_source?.name,
          investor: payload?.data?.investor.id,
          investorName: payload?.data?.investor.name,
          tenderer: payload?.data?.tenderer.id,
          selection_method: payload?.data?.selection_method.id,
          selection_methodName: payload?.data?.selection_method.method_name,
          staff: payload?.data?.staff?.id,
          staffName: payload?.data?.staff?.name,
          tendererName: payload?.data?.tenderer?.name,
          attachments: payload?.data?.attachments,
        };
        state.loading = false;
      })
      .addCase(getProjectById.rejected, (state, { payload }: PayloadAction<IProject> | any) => {
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createProject.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createProject.fulfilled, (state, { payload }: PayloadAction<INewProject> | any) => {
        console.log(payload);

        state.status = EFetchStatus.FULFILLED;
        state.dataCreateProject = {
          ...payload.data,
          files: payload.data.attachments,
          funding_source_id: payload?.data?.funding_source.id,
          industry_id: payload?.data?.industries?.map((item: any) => item.id),
          investor_id: payload?.data?.investor.id,
          procurement_id: payload?.data?.procurement_categories?.map((item: any) => item.id),
          tenderer_id: payload?.data?.investor.id,
        };

        state.message = "Tạo mới thành công ";
      })
      .addCase(createProject.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });

    builder
      .addCase(updateProject.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateProject.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateProject.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });
    builder
      .addCase(approveProject.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(approveProject.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Phê duyệt thành công";
      })
      .addCase(approveProject.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });
    builder
      .addCase(changeStatusProject.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusProject.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusProject.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });
    // ? Delete tag
    builder
      .addCase(deleteProject.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteProject.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.projects = state.projects.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteProject.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });

    builder
      .addCase(getListProject.fulfilled, (state, { payload }: PayloadAction<IResponse<IProject[]> | any>) => {
        if (payload) {
          state.listProjects = payload.data;
        }
      })
      .addCase(getListProject.rejected, (state, { payload }: PayloadAction<IResponse<IProject[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = projectSlice.actions;
export { projectSlice };
