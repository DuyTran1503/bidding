import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IError } from "@/shared/interface/error";
import { IProcurement } from "./procurement.model";

const prefix = "/api/admin/procurement-categories";

export const getAllProcurements = createAsyncThunk("staff/get-all-procurement-categories", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IProcurement[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getProcurementById = createAsyncThunk(
  "procurement-categories/get-procurement-categories-by-id",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IProcurement>(prefix + `/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createProcurement = createAsyncThunk(
  "procurement-categories/create-procurement-categories",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data as IError);
    }
  },
);

export const updateProcurement = createAsyncThunk(
  "procurement-categories/update-procurement-categories",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteProcurement = createAsyncThunk("procurement-categories/delete-procurement-categories", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusProcurement = createAsyncThunk(
  "procurement-categories/change-status-procurement-categories",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getListProcurement = createAsyncThunk("procurement-categories/get-list-procurement-categories", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-procurement-categories`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
