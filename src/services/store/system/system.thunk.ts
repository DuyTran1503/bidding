import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { ISystem } from "./system.model";
import { objectToFormData } from "@/shared/utils/common/formData";

const prefix = "/api/admin/system";

export const getSystem = createAsyncThunk("system/get-system", async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ISystem[]>(`/api/get-system`, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });
  
  export const getSystems = createAsyncThunk("system/get-systems", async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { response, data } = await client.get<ISystem[]>(prefix, payload);
      return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });

export const updateSystem = createAsyncThunk("system/update-system", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as ISystem);
    formData.append("_method", "PUT");

    const accessToken = client.tokens.accessToken();

    const response = await fetch(import.meta.env.VITE_API_URL + `${prefix}/${payload?.param}`, {
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
