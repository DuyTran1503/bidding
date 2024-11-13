<<<<<<< HEAD
// import { client } from "@/services/config/client";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { IThunkPayload } from "@/shared/utils/shared-interfaces";

// const prefix = "/api/admin/charts/enterprises/";

// export const getSalaryOfEmployees = createAsyncThunk("staff/salary_of_employees", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.post(prefix + "employee-salary-statistic-by-enterprise", payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
=======
import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";

const prefix = "/api/admin/charts/enterprises/";

export const getSalaryOfEmployees = createAsyncThunk("enterprises/salary_of_employees", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix + "employee-salary-statistic-by-enterprise", payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

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
>>>>>>> c9843c114bb21f52324f28d188c3ec3bcb431663
