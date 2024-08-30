import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IActivityLog } from "./activityLog.model";
import { IError } from "@/shared/interface/error";

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

export const createActivityLog = createAsyncThunk(
  "activity-logs/create-activity-logs", 
  async (payload: IThunkPayload, { rejectWithValue }) => {
try {
  const { response, data } = await client.post(prefix, payload);
  return response.status >= 400 ? rejectWithValue(data) : data;
} catch (error: any) {
  return rejectWithValue(error.response.data as IError);
}
});

export const updateActivityLog = createAsyncThunk(
  "activity-logs/update-activity-logs",
  async (payload: IThunkPayload, { rejectWithValue }) => {
try {
  const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
  return response.status >= 400 ? rejectWithValue(data) : data;
} catch (error: any) {
  return rejectWithValue(error.response.data);
}
});

export const deleteActivityLog = createAsyncThunk(
  "activity-logs/delete-activity-logs", 
  async (id: string, { rejectWithValue }) => {
try {
  const { response, data } = await client.delete(`${prefix}/${id}`);
  return response.status >= 400 ? rejectWithValue(data) : id;
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