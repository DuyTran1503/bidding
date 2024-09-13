import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IBiddingHistory } from "./biddingHistory.model";

const prefix = "/api/admin/bidding-historys";

export const getAllBiddingHistorys = createAsyncThunk(
    "bidding-history/get-all-bidding-historys", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBiddingHistory[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBiddingHistoryById = createAsyncThunk(
    "bidding-history/get-bidding-history-by-id", 
    async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBiddingHistory[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBiddingHistoryAllIds = createAsyncThunk(
  "bidding-history/get-bidding-history-all-ids",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IBiddingHistory[]>(`${prefix}/all-ids`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createBiddingHistory = createAsyncThunk(
    "bidding-history/create-bidding-history", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateBiddingHistory = createAsyncThunk(
    "bidding-history/update-bidding-history", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteBiddingHistory = createAsyncThunk("bidding-history/delete-bidding-history", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusBiddingHistory = createAsyncThunk(
  "bidding-history/change-status-bidding-history",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
