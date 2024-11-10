import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IEvaluate } from "./evaluate.model";

const prefix = "/api/admin/evaluates";

export const getAllEvaluates = createAsyncThunk("evaluate/get-all-evaluates", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEvaluate[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getEvaluateById = createAsyncThunk("evaluate/get-evaluate-by-id", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEvaluate[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createEvaluate = createAsyncThunk("evaluate/create-evaluate", 
  async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateEvaluate = createAsyncThunk("evaluate/update-evaluate", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteEvaluate = createAsyncThunk("evaluate/delete-evaluate", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});