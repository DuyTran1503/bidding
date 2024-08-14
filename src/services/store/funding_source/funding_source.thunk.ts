import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFundingSource } from "./funding_source.model";
import { IError } from "@/shared/interface/error";

const prefix = "/api/admin/funding-sources";

export const getAllFundingSources = createAsyncThunk(
  "staff/get-all-fundingsources",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IFundingSource[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getFundingSourceById = createAsyncThunk(
    "funding-sources/get-funding-sources-by-id", 
    async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IFundingSource>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createFundingSource = createAsyncThunk(
    "funding-sources/create-funding-sources", 
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateFundingSource = createAsyncThunk(
    "funding-sources/update-funding-sources",
    async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteFundingSources = createAsyncThunk(
    "funding-sources/delete-funding-sources", 
    async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusFundingSource = createAsyncThunk(
    "funding-sources/change-status-funding-sources",
    async (id: string, { rejectWithValue }) => {
      try {
        const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
        return response.status >= 400 ? rejectWithValue(data) : id;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );
  export const getListBusinessActivity = createAsyncThunk(
    "funding-sources/get-list-funding-sources",
    async (_, { rejectWithValue }) => {
      try {
        const { response, data } = await client.get(`${prefix}/all-ids`);
        return response.status >= 400 ? rejectWithValue(data) : data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    },
  );
