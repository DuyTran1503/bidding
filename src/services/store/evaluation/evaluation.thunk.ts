import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IEvaluationCriteria } from "./evaluation.model";
import { IError } from "@/shared/interface/error";

const prefix = "/api/admin/evaluation-criterias";

export const getAllEvaluations = createAsyncThunk("evaluation/get-all-banners", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEvaluationCriteria[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getEvaluationById = createAsyncThunk("evaluation/get-evaluation-by-id", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEvaluationCriteria[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getListEvaluation = createAsyncThunk("evaluation/get-evaluation-list", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEvaluationCriteria[]>(`/api/admin/list-evaluation-criterias`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createEvaluation = createAsyncThunk("evaluation/create-evaluation", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateEvaluation = createAsyncThunk("evaluation/update-evaluation", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.put(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteEvaluation = createAsyncThunk("evaluation/delete-evaluation", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusEvaluation = createAsyncThunk("evaluation/change-status-evaluation", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.put(`${prefix}/${id}/changeActive`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
