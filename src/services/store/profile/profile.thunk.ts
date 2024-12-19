import { client } from "@/services/config/client";
import { objectToFormData } from "@/shared/utils/common/formData";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IEditProfile } from "./profile.model";

const prefix = "/api/auth";

export const getEditProfile = createAsyncThunk("get-edit-profile", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEditProfile[]>(`${prefix}/edit-profile`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const updateEditProfile = createAsyncThunk("edit_profile/update-edit-profile", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as IEditProfile);

    // Thêm trường _method với giá trị "PUT" vào formData
    formData.append("_method", "POST");

    const accessToken = client.tokens.accessToken();

    const response = await fetch(import.meta.env.VITE_API_URL + `${prefix}/update-profile`, {
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
