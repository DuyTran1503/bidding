import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IStatisticalReport } from "./statisticalReport.model";

const prefix = "/api/admin/statistical-reports";

export const getAllStatisticalReports = createAsyncThunk(
  "statistical-report/get-all-statistical-reports",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IStatisticalReport[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getStatisticalReportById = createAsyncThunk(
  "statistical-report/get-statistical-report-by-id",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IStatisticalReport[]>(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createStatisticalReport = createAsyncThunk(
  "statistical-report/create-statistical-report",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateStatisticalReport = createAsyncThunk(
  "statistical-report/update-statistical-report",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteStatisticalReport = createAsyncThunk(
  "statistical-report/delete-statistical-report",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const changeStatusStatisticalReport = createAsyncThunk(
  "statistical-report/change-status-statistical-report",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
