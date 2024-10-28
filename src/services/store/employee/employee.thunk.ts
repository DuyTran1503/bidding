import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IEmployee } from "./employee.model";
import { objectToFormData } from "@/shared/utils/common/formData";

const prefix = "/api/admin/employees";

export const getAllEmployee = createAsyncThunk("employee/get-all-employee", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEmployee[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getEmployeeById = createAsyncThunk("employee/get-employee-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEmployee>(prefix + `/${id}/edit`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const createEmployee = createAsyncThunk("employee/create-employee", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.post(prefix, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
export const createEmployee = createAsyncThunk("enterprises/create-enterprises", async (request: Omit<IEmployee, "id">, thunkAPI) => {
  try {
    const formData = objectToFormData(request);

    const accessToken = client.tokens.accessToken();

    const response = await fetch(import.meta.env.VITE_API_URL + prefix, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return thunkAPI.rejectWithValue(error);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
// export const updateEmployee = createAsyncThunk("employee/update-employee", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.put(`${prefix}/${payload?.param}`, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
export const updateEmployee = createAsyncThunk("enterprises/update-enterprises", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as IEmployee);

    // Thêm trường _method với giá trị "PUT" vào formData
    formData.append("_method", "PUT");

    const accessToken = client.tokens.accessToken();

    const response = await fetch(import.meta.env.VITE_API_URL + `${prefix}/${payload?.param}`, {
      method: "POST", // Thay đổi method thành "POST"
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return thunkAPI.rejectWithValue(error);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const deleteEmployee = createAsyncThunk("employee/delete-employee", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusEmployee = createAsyncThunk("employee/change-status-employee", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(`${prefix}/ban/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getListEmployee = createAsyncThunk("get-list-all-employee", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-employees`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
