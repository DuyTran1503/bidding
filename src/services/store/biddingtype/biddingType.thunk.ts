import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IBiddingType } from "./biddingType.model";

const prefix = "/api/admin/bidding-types";

export const getAllBiddingTypes = createAsyncThunk("bidding-type/get-all-bidding-types", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBiddingType[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBiddingTypeById = createAsyncThunk("bidding-type/get-bidding-type-by-id", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBiddingType[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const getBiddingTypeAllIds = createAsyncThunk(
//   "bidding-type/get-bidding-type-all-ids",
//   async (payload: IThunkPayload, { rejectWithValue }) => {
//     try {
//       const { response, data } = await client.get<IBiddingType[]>(`${prefix}/all-ids`, payload);
//       return response.status >= 400 ? rejectWithValue(data) : data;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     }
//   },
// );

export const createBiddingType = createAsyncThunk("bidding-type/create-bidding-type", 
  async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateBiddingType = createAsyncThunk("bidding-type/update-bidding-type", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteBiddingType = createAsyncThunk("bidding-type/delete-bidding-type", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusBiddingType = createAsyncThunk(
  "bidding-type/change-status-bidding-type",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
