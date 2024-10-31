// chart.thunk.ts
import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IChart } from "./chart.model";

const prefix = "/api/admin/dashboard/charts";
const prefixx = "/api/admin/charts";

// chart project-by-industry
export const projectByIndustry = createAsyncThunk(
  "chart/project-by-industry",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-industry`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart project-by-fundingsource
export const projectByFundingsource = createAsyncThunk(
  "chart/project-by-fundingsource",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-fundingsource`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart project-by-domestic
export const projectByDomestic = createAsyncThunk(
  "chart/project-by-domestic",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-domestic`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart project-by-submission-method
export const projectBySubmissionMethod = createAsyncThunk(
  "chart/project-by-submission-method",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-submission-method`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart project-by-selection-method
export const projectBySelectionMethod = createAsyncThunk(
  "chart/project-by-selection-method",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-selection-method`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart project-by-tenderer-investor
export const projectByTendererInvestor = createAsyncThunk(
  "chart/project-by-tenderer-investor",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-tenderer-investor`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart project-by-organization-type
export const projectByOrganizationType = createAsyncThunk(
  "chart/project-by-organization-type",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-organization-type`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart average-project-duration-by-industry
export const averageProjectPurationByIndustry = createAsyncThunk(
  "chart/average-project-duration-by-industry",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/average-project-duration-by-industry`,  payload );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// chart enterprises/{id}/employee-education-level-statistic-by-enterprise
export const employeeEducationLevelStatisticByEnterprise = createAsyncThunk(
  "chart/employee-education-level-statistic-by-enterprise",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart>(`${prefixx}/enterprises/${id}/employee-education-level-statistic-by-enterprise`);
      return data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  }
);
