import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IError } from "@/shared/interface/error";
import { IAttachment } from "./attachment.model";

const prefix = "/api/admin/attachment";

export const getAllAttachment = createAsyncThunk("staff/get-all-attachment", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IAttachment[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getAttachmentById = createAsyncThunk("attachment/get-attachment-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IAttachment>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createAttachment = createAsyncThunk("attachment/create-attachment", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);

    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateAttachment = createAsyncThunk("attachment/update-attachment", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload?.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteAttachment = createAsyncThunk("attachment/delete-attachment", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusAttachment = createAsyncThunk("attachment/change-status-attachment", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
