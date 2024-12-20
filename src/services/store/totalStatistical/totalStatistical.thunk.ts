import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ITotalStatistical } from "./totalStatistical.model";

const prefix = "/api/admin";

export const countProjects = createAsyncThunk("admin/count-data", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ITotalStatistical[]>(prefix + "/count-data");
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
