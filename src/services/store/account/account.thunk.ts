import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IStaff } from "./account.model";

const prefix = "/api/admin/staff";

export const getAllStaff = createAsyncThunk("staff/get-all-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IStaff[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getStaffById = createAsyncThunk("staff/get-staff-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IStaff>(prefix + `/${id}/edit`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createStaff = createAsyncThunk("staff/create-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    console.log({ response, data });

    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateStaff = createAsyncThunk("staff/update-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.put(`${prefix}/${payload?.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteStaff = createAsyncThunk("staff/delete-staff", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusStaff = createAsyncThunk("staff/change-status-staff", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(`${prefix}/ban/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
