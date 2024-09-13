import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IActivityLog } from "./activityLog.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getActivityLogById, getAllActivityLogs, getListActivityLog,  } from "./activityLog.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";

export interface IActivityLogInitialState extends IInitialState {
    activityLogs: IActivityLog[];
    activityLog?: IActivityLog | any;
    listActivityLogs: IActivityLog[];
  }

  const initialState: IActivityLogInitialState = {
    status: EFetchStatus.IDLE,
    activityLogs: [],
    listActivityLogs: [],
    activityLog: undefined,
    message: "",
    error: undefined,
    filter: {
      size: 10,
      page: 1,
    },
    totalRecords: 0,
    number_of_elements: 0,
  };

  const activityLogSlice = createSlice({
    name: "activity_log",
    initialState,
    reducers: {
      ...commonStaticReducers<IActivityLogInitialState>(),
      fetching(state) {
        state.loading = true;
      },
      resetMessageError(state) {
        state.message = "";
      },
    },

    extraReducers(builder) {

      // get all
        builder
        .addCase(getAllActivityLogs.fulfilled, (state, { payload }: PayloadAction<IResponse<IActivityLog[]> | any>) => {
          if (payload.data) {
            state.fundingSources = payload.data.data;
            state.totalRecords = payload?.data?.total_elements;
            state.number_of_elements = payload?.data?.number_of_elements;
          }
        })
        .addCase(getAllActivityLogs.rejected, (state, { payload }: PayloadAction<IResponse<IActivityLog[]> | any>) => {
          state.message = transformPayloadErrors(payload?.errors);
        });
        
      // get ById
      builder
        .addCase(getActivityLogById.fulfilled, (state, { payload }: PayloadAction<IActivityLog[]> | any) => {
          state.activityLog = payload.data;
          state.loading = false;
        })
        .addCase(getActivityLogById.rejected, (state, { payload }: PayloadAction<IActivityLog> | any) => {
          state.activityLog = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
          state.loading = true;
        });

      // get list
        builder
      .addCase(getListActivityLog.fulfilled, (state, { payload }: PayloadAction<IResponse<IActivityLog[]> | any>) => {
        if (payload.data) {
          state.listActivityLogs = payload.data;
        }
      })
      .addCase(getListActivityLog.rejected, (state, { payload }: PayloadAction<IResponse<IActivityLog[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    }

  });
  export const { resetStatus, setFilter, fetching, resetMessageError } = activityLogSlice.actions;
  export { activityLogSlice };