import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { ISelectionMethod } from "./selectionMethod.model";

const prefix = "/api/admin/selection-methods";

export const getAllSelectionMethods = createAsyncThunk(
  "selection-method/get-all-selection-methods",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ISelectionMethod[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getListSelectionMethods = createAsyncThunk("selection-method/get-list-selection-methods", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ISelectionMethod[]>(prefix);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getSelectionMethodById = createAsyncThunk(
  "selection-method/get-selection-method-by-id",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ISelectionMethod[]>(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getSelectionMethodAllIds = createAsyncThunk(
  "selection-method/get-selection-method-all-ids",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ISelectionMethod[]>(`${prefix}/all-ids`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createSelectionMethod = createAsyncThunk(
  "selection-method/create-selection-method",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateSelectionMethod = createAsyncThunk(
  "selection-method/update-selection-method",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteSelectionMethod = createAsyncThunk(
  "selection-method/delete-selection-method",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const changeStatusSelectionMethod = createAsyncThunk(
  "selection-method/change-status-selection-method",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
