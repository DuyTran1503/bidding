import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IReputation } from "./reputation.model";

const prefix = "/api/admin/reputations";

export const getAllReputations = createAsyncThunk("staff/get-all-reputations", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IReputation[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getReputationById = createAsyncThunk("reputations/get-reputations-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IReputation>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getListReputations = createAsyncThunk("reputations/get-list-reputations", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-reputations`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});