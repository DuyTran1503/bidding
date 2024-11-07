// compareProject.thunks.ts
import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";

const prefix = "/api/admin/charts/enterprises";

export const avgDifficultyByEnterprise = createAsyncThunk(
    "enterprise/avgDifficultyByEnterprise",
    async (payload: IThunkPayload, { rejectWithValue }) => {
      try {
        const { data } = await client.post(`${prefix}/average-difficulty-level-tasks-by-enterprise`, payload);
        return data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
      }
    },
  );

  export const detailEnterpriseByIds = createAsyncThunk("enterprise/detailEnterpriseByIds", async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.post(`${prefix}/detail-enterprise-by-ids`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  });
