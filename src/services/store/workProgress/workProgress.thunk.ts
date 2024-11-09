import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IError } from "@/shared/interface/error";
import { IWorkProgress } from "./workProgress.model";
const prefix = "/api/admin/work-progresses";

export const getAllWorkProgresses = createAsyncThunk("staff/get-all-work-progresses", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IWorkProgress[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getWorkProgressById = createAsyncThunk("work-progresses/get-work-progresses-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IWorkProgress>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createWorkProgress = createAsyncThunk("work-progresses/create-work-progresses", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateWorkProgress = createAsyncThunk("work-progresses/update-work-progresses", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteWorkProgress = createAsyncThunk("work-progresses/delete-work-progresses", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getListWorkProgresses = createAsyncThunk("work-progresses/get-list-work-progresses", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-work-progresses`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
