// compareProject.thunks.ts
import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";

const prefix = "/api/admin/compare-projects";

export const compareBarChartTotalAmount = createAsyncThunk(
  "compareProject/compareBarChartTotalAmount",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.post(`${prefix}/compare-bar-chart-total-amount`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

export const compareConstructionTime = createAsyncThunk(
  "compareProject/compareConstructionTime",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.post(`${prefix}/comparing-construction-time`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

export const compareBidSubmissionTime = createAsyncThunk(
  "compareProject/compareBidSubmissionTime",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.post(`${prefix}/comparing-did-submission-time`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

export const comparePieChartTotalAmount = createAsyncThunk(
  "compareProject/comparePieChartTotalAmount",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.post(`${prefix}/compare-pie-chart-total-amount`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

export const compareBidderCount = createAsyncThunk("compareProject/compareBidderCount", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/compare-bidder-count`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

export const detailProjectByIds = createAsyncThunk("compareProject/detailProjectByIds", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/detail-project-by-ids`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});
