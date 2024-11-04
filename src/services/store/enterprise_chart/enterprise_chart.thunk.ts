import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IChartEnterprise } from "./enterprise_chart.model";

const prefix = "/api/admin/charts/enterprises/";

export const getSalaryOfEmployees = createAsyncThunk("staff/salary_of_employees", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IChartEnterprise[]>(prefix + "employee-salary-statistic-by-enterprise", payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
