import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IError } from "@/shared/interface/error";
import { IBidDocument } from "./bid_document.model";

const prefix = "/api/admin/bid-documents";

export const getAllBidDocument = createAsyncThunk("staff/get-all-bid-documents", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidDocument[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBidDocumentById = createAsyncThunk("bid_document/get-bid-documents-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidDocument>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createBidDocument = createAsyncThunk("bid_document/create-bid-documents", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);

    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateBidDocument = createAsyncThunk("bid_document/update-bid-documents", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload?.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteBidDocument = createAsyncThunk("bid_document/delete-bid-documents", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusBidDocument = createAsyncThunk("bid_document/change-status-bid-documents", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
