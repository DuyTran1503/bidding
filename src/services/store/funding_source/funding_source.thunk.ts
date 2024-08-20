import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFundingSource } from "./funding_source.model";
import { IError } from "@/shared/interface/error";

<<<<<<< HEAD
const prefix = "http://localhost:4000/funding_sources";

export const getAllFundingSources = createAsyncThunk("funding-source/get-all-funding-sources", async(payload: IThunkPayload, { rejectWithValue }) => {
=======
const prefix = "/api/admin/funding-sources";

export const getAllFundingSources = createAsyncThunk(
  "staff/get-all-fundingsources",
  async (payload: IThunkPayload, { rejectWithValue }) => {
>>>>>>> 9a3f06f5e9c80c0fa9e0c5955c4a3a6877bef405
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

<<<<<<< HEAD
export const getFundingSourceById = createAsyncThunk("funding-source/get-funding-sources-by-id", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFundingSource>(prefix +  `/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const createFundingSource = createAsyncThunk("funding-source/create-funding-source", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.post<IFundingSource[]>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const updateFundingSource = createAsyncThunk("funding-source/update-funding-source", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.patch<IFundingSource[]>(`${prefix}/${payload.param}`, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const deleteFundingSources = createAsyncThunk("funding-source/delete-funding-source", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.delete(`${prefix}/${id}`);
=======
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
>>>>>>> 9a3f06f5e9c80c0fa9e0c5955c4a3a6877bef405
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
