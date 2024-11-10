import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBidBond } from "./bidBond.model";
import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IError } from "@/shared/interface/error";

const prefix = "/api/admin/bid-bonds";

export const getAllBidBonds = createAsyncThunk("staff/get-all-bid-bonds", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidBond[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBidBondById = createAsyncThunk("bid-bonds/get-bid-bonds-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidBond>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createBidBond = createAsyncThunk("bid-bonds/create-bid-bonds", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateBidBond = createAsyncThunk("bid-bonds/update-bid-bonds", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteBidBond = createAsyncThunk("bid-bonds/delete-bid-bonds", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusBidBond = createAsyncThunk("bid-bonds/change-status-bid-bonds", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getListBidBond = createAsyncThunk("bid-bonds/get-list-bid-bonds", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`${prefix}/all-ids`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
