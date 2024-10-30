import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { ISupport } from "./support.model";
import { objectToFormData } from "@/shared/utils/common/formData";

const prefix = "/api/admin/supports";

export const getAllSupports = createAsyncThunk("support/get-all-supports", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ISupport[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getSupportById = createAsyncThunk("support/get-support-by-id", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ISupport[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getSupportAllIds = createAsyncThunk(
  "support/get-support-all-ids",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ISupport[]>(`${prefix}/all-ids`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createSupport = createAsyncThunk("support/create-support", async (request: Omit<ISupport, "id">, thunkAPI) => {
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

export const deleteSupport = createAsyncThunk("support/delete-support", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusSupport = createAsyncThunk(
  "support/change-status-support",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const accessToken = client.tokens.accessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL + prefix}/${id}`, {
        method: "PUT", // Hoặc "POST" nếu API yêu cầu POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Đảm bảo gửi token xác thực nếu cần
        },
        body: JSON.stringify({ status }), // Chuyển đổi object sang JSON với key là "status"
      });

      // Xử lý lỗi nếu có
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      const data = await response.json();
      return data; // Trả về dữ liệu từ API
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
