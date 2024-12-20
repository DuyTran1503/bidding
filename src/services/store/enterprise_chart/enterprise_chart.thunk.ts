import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";

const prefix = "/api/admin/charts/enterprises/";

// Bỏ
export const getSalaryOfEmployees = createAsyncThunk("enterprises/salary_of_employees", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix + "employee-salary-statistic-by-enterprise", payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// employee-result-bidding-statistic-by-enterprise
export const getEmployeeResultBiddingStatistic = createAsyncThunk(
  "enterprises/employee-result-bidding-statistic-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "employee-result-bidding-statistic-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// employee-project-statistic-by-enterprise
export const getEmployeeProjectStatistic = createAsyncThunk(
  "enterprises/employee-project-statistic-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "employee-project-statistic-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Bỏ
export const getAverageDifficultyLevelTasks = createAsyncThunk(
  "enterprises/average-difficulty-level-tasks-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "average-difficulty-level-tasks-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Bỏ
export const getEmployeeQuantityStatistic = createAsyncThunk(
  "enterprises/employee-qty-statistic-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "employee-qty-statistic-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// average-difficulty-level-tasks-by-enterprise
export const averageDifficultyLevelTasksByEnterprise = createAsyncThunk(
  "enterprises/average-difficulty-level-tasks-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "average-difficulty-level-tasks-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// average-difficulty-level-tasks-by-employee
export const averageDifficultyLevelTasksByEmployee = createAsyncThunk(
  "enterprises/average-difficulty-level-tasks-by-employee",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "average-difficulty-level-tasks-by-employee", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// average-feedback-by-employee
export const averageFeedbackByEmployee = createAsyncThunk(
  "enterprises/average-feedback-by-employee",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "average-feedback-by-employee", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// project-completed-by-enterprise
export const projectCompletedByEnterprise = createAsyncThunk(
  "enterprises/project-completed-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "project-completed-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// project-won-by-enterprise
export const projectWonByEnterprise = createAsyncThunk(
  "enterprises/project-won-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "project-won-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// evaluations-statistics-by-enterprise
export const evaluationsStatisticsByEnterprise = createAsyncThunk(
  "enterprises/evaluations-statistics-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "evaluations-statistics-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// reputations-statistics-by-enterprise
export const reputationsStatisticsByEnterprise = createAsyncThunk(
  "enterprises/reputations-statistics-by-enterprise",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "reputations-statistics-by-enterprise", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// detail-enterprise-by-ids
export const detailEnterpriseByIds = createAsyncThunk("detail-enterprise-by-ids", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix + "detail-enterprise-by-ids", payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
// detail-enterprise-by-ids
export const employeeEducationLevel = createAsyncThunk(
  "employee-education-level-statistic-by-enterprises",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.post(prefix + "employee-education-level-statistic-by-enterprises", payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
