import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IEvaluationCriteria } from "./evaluation_criteria.model";

const prefix = "api/admin/evaluation_criteria";

export const getAllEvaluationCriteria = createAsyncThunk(
  "evaluation_criteria/get-all-evaluation_criteria",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IEvaluationCriteria[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getEvaluationCriteriaById = createAsyncThunk(
  "evaluation_criteria/get-evaluation_criteria-by-id",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IEvaluationCriteria[]>(prefix + `/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const createEvaluationCriteria = createAsyncThunk(
  "evaluation_criteria/create-evaluation_criteria",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post<IEvaluationCriteria[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const updateEvaluationCriteria = createAsyncThunk(
  "evaluation_criteria/update-evaluation_criteria",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post<IEvaluationCriteria[]>(`${prefix}/${payload?.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const deleteEvaluationCriteria = createAsyncThunk(
  "evaluation_criteria/delete-evaluation_criteria",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
