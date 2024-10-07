import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IProcurementCategorie } from "./procurementCategorie.model";

const prefix = "/api/admin/procurement-categories";

export const getAllProcurementCategories = createAsyncThunk(
  "procurement-categorie/get-all-procurement-categories",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IProcurementCategorie[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getListProcurementCategories = createAsyncThunk("procurement-categorie/get-list-procurement-categories", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IProcurementCategorie[]>(`/api/admin/list-procurement-categories`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getProcurementCategorieById = createAsyncThunk(
  "procurement-categorie/get-procurement-categorie-by-id",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IProcurementCategorie[]>(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getProcurementCategorieAllIds = createAsyncThunk(
  "procurement-categorie/get-procurement-categorie-all-ids",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IProcurementCategorie[]>(`${prefix}/all-ids`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createProcurementCategorie = createAsyncThunk(
  "procurement-categorie/create-procurement-categorie",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateProcurementCategorie = createAsyncThunk(
  "procurement-categorie/update-procurement-categorie",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteProcurementCategorie = createAsyncThunk(
  "procurement-categorie/delete-procurement-categorie",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const changeStatusProcurementCategorie = createAsyncThunk(
  "procurement-categorie/change-status-procurement-categorie",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
