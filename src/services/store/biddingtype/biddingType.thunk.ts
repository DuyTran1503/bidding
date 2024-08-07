import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IBiddingType } from "./biddingType.model";

const prefix = "/api/admin/bidding-fields";

export const getAllBiddingTypes = createAsyncThunk("bidding-field/get-all-bidding-fields", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBiddingType[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBiddingTypeById = createAsyncThunk("bidding-field/get-bidding-field-by-id", async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<IBiddingType[]>(prefix+ `${id}`);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });

  export const createBiddingType = createAsyncThunk("bidding-field/create-bidding-field", async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });
  
  export const updateBiddingType = createAsyncThunk("bidding-field/update-bidding-field", async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });
  
  export const deleteBiddingType = createAsyncThunk("bidding-field/delete-bidding-field", async (id: number | string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.delete(`${prefix}/${id}`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });
