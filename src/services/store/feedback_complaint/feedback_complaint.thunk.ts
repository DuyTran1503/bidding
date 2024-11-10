import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFeedbackComplaint } from "./feedback_complaint.model";

const prefix = "/api/admin/feedback-complaint";

export const getAllFeedbackComplaints = createAsyncThunk("staff/get-all-feedbacks-complaints", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IFeedbackComplaint[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getFeedbackComplaintById = createAsyncThunk("feedback-complaint/get-feedback-complaint-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IFeedbackComplaint>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateFeedbackComplaint = createAsyncThunk("feedback-complaint/update-feedback-complaint", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteFeedbackComplaint = createAsyncThunk("feedback-complaint/delete-feedback-complaint", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusFeedbackComplaint = createAsyncThunk(
  "feedback-complaint/change-status-feedback-complaint",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getListFeedbackComplaints = createAsyncThunk("feedback-complaint/get-list-feedback-complaint", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-feedback-complaint`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
