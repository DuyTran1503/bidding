import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IActivityLog } from "./activityLog.model";

const prefix = "/api/admin/activity-logs";

export const getAllActivityLogs = createAsyncThunk(
    "staff/get-all-activity-logs",
    async (payload: IThunkPayload, { rejectWithValue }) => {
      try {
        const { response, data } = await client.get<IActivityLog[]>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );
  export const getActivityLogById = createAsyncThunk(
    "activity-logs/get-activity-logs-by-id", 
    async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IActivityLog>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getListActivityLog = createAsyncThunk(
    "activity-logs/get-list-activity-logs",
    async (_, { rejectWithValue }) => {
      try {
        const { response, data } = await client.get(`${prefix}/all-ids`);
        return response.status >= 400 ? rejectWithValue(data) : data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );