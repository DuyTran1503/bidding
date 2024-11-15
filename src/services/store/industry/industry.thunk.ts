import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IError } from "@/shared/interface/error";
import { IIndustry } from "./industry.model";

const prefix = "/api/admin";

export const getAllIndustry = createAsyncThunk("industry/get-all-industry", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IIndustry[]>(`${prefix}/industries`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getIndustryById = createAsyncThunk("industry/get-industry-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IIndustry>(`${prefix}/industries` + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createIndustry = createAsyncThunk("industry/create-industry", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(`${prefix}/industries`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateIndustry = createAsyncThunk("industry/update-industry", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/industries/${payload?.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteIndustry = createAsyncThunk("industry/delete-industry", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/industries/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusIndustry = createAsyncThunk("industry/change-status-industry", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/industries/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getIndustries = createAsyncThunk("enterprises/get-list-industries", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`${prefix}/list-industries`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
