import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IError } from "@/shared/interface/error";
import { IIntroduction } from "./introduction.moldel";

const prefix = "/api/admin/introductions";

export const getAllIntroductions = createAsyncThunk("staff/get-all-introductions", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IIntroduction[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getIntroductionById = createAsyncThunk("introductions/get-introductions-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IIntroduction>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createIntroduction = createAsyncThunk("introductions/create-introductions", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateIntroduction = createAsyncThunk("introductions/update-introductions", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteIntroduction = createAsyncThunk("introductions/delete-introductions", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusIntroduction = createAsyncThunk(
  "introductions/change-status-introductions",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getListIntroduction = createAsyncThunk("introductions/get-list-introductions", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-introductions`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
