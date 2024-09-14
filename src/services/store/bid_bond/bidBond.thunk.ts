import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBidBond } from "./bidBond.model";
import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IError } from "@/shared/interface/error";

const prefix = "/api/admin/bidbond";

export const getAllBidBonds = createAsyncThunk(
    "staff/get-all-bidbonds",
    async (payload: IThunkPayload, { rejectWithValue }) => {
      try {
        const { response, data } = await client.get<IBidBond[]>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );

  export const getBidBondById = createAsyncThunk(
    "bidbonds/get-bidbond-by-id", 
    async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidBond>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createBidBond = createAsyncThunk(
    "bidbonds/create-bidbonds", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateBidBond = createAsyncThunk(
    "bidbonds/update-bidbonds",
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteBidBond = createAsyncThunk(
    "bidbonds/delete-bidbonds", 
    async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusBidBond = createAsyncThunk(
    "bidbonds/change-status-bidbonds",
    async (id: string, { rejectWithValue }) => {
      try {
        const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
        return response.status >= 400 ? rejectWithValue(data) : id;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );
  export const getListBidBond = createAsyncThunk(
    "bidbonds/get-list-bidbonds",
    async (_, { rejectWithValue }) => {
      try {
        const { response, data } = await client.get(`${prefix}/all-ids`);
        return response.status >= 400 ? rejectWithValue(data) : data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );