import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IPostCatalog } from "./postCatalog.model";

const prefix = "/api/admin/post-catalogs";

export const getAllPostCatalogs = createAsyncThunk(
  "post-catalog/get-all-post-catalogs",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IPostCatalog[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getPostCatalogById = createAsyncThunk(
  "post-catalog/get-post-catalog-by-id",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IPostCatalog[]>(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createPostCatalog = createAsyncThunk(
  "post-catalog/create-post-catalog",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updatePostCatalog = createAsyncThunk(
  "post-catalog/update-post-catalog",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deletePostCatalog = createAsyncThunk(
  "post-catalog/delete-post-catalog",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const changeStatusPostCatalog = createAsyncThunk(
  "post-catalog/change-status-post-catalog",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
