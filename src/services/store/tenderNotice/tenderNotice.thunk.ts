import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { ITenderNotice } from "./tenderNotice.model";

const prefix = "/api/admin/tender-notices";

export const getAllTenderNotices = createAsyncThunk(
    "tender-notice/get-all-tender-notices", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ITenderNotice[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getTenderNoticeById = createAsyncThunk(
    "tender-notice/get-tender-notice-by-id", 
    async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ITenderNotice[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getTenderNoticeAllIds = createAsyncThunk(
  "tender-notice/get-tender-notice-all-ids",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ITenderNotice[]>(`${prefix}/all-ids`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createTenderNotice = createAsyncThunk(
    "tender-notice/create-tender-notice", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateTenderNotice = createAsyncThunk(
    "tender-notice/update-tender-notice", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteTenderNotice = createAsyncThunk("tender-notice/delete-tender-notice", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusTenderNotice = createAsyncThunk(
  "tender-notice/change-status-tender-notice",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
