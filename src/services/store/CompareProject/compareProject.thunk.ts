// compareprojectt.thunk.ts
import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICompareProject } from "./compareProject.model";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";

const prefix = "/api/admin/compare-projects";

// compareprojectt project-by-industry
export const compareBarChartTotalAmount = createAsyncThunk("compare-bidder-count", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/compare-bidder-count`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});
