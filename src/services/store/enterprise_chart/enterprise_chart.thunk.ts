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
