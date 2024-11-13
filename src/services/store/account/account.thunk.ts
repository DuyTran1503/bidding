import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IStaff } from "./account.model";
import { objectToFormData } from "@/shared/utils/common/formData";

const prefix = "/api/admin/staff";

export const getAllStaff = createAsyncThunk("staff/get-all-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IStaff[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getStaffById = createAsyncThunk("staff/get-staff-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IStaff>(prefix + `/${id}/edit`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const createStaff = createAsyncThunk("staff/create-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.post(prefix, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
export const createStaff = createAsyncThunk("enterprises/create-enterprises", async (request: Omit<IStaff, "id">, thunkAPI) => {
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
// export const updateStaff = createAsyncThunk("staff/update-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.put(`${prefix}/${payload?.param}`, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
export const updateStaff = createAsyncThunk("enterprises/update-enterprises", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as IStaff);

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
export const deleteStaff = createAsyncThunk("staff/delete-staff", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusStaff = createAsyncThunk("staff/change-status-staff", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(`${prefix}/ban/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getListStaff = createAsyncThunk("get-list-all-staff", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-staffs`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
