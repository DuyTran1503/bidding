import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IBusinessActivity } from "./business-activity.model";
import { IError } from "@/shared/interface/error";

const prefix = "/api/admin/business-activity-types";

export const getAllBusinessActivity = createAsyncThunk(
  "staff/get-all-business-activity-types",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IBusinessActivity[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getBusinessActivityById = createAsyncThunk(
  "business-activity-types/get-business-activity-types-by-id",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IBusinessActivity>(prefix + `/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createBusinessActivity = createAsyncThunk(
  "business-activity-types/create-business-activity-types",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);

      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data as IError);
    }
  },
);

export const updateBusinessActivity = createAsyncThunk(
  "business-activity-types/update-business-activity-types",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload?.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteBusinessActivity = createAsyncThunk(
  "business-activity-types/delete-business-activity-types",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const changeStatusBusinessActivity = createAsyncThunk(
  "business-activity-types/change-status-business-activity-types",
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
  "business-activity-types/get_list_business-activity-types",
  async (_, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get(`${prefix}/all-ids`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
