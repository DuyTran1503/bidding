import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IBanner } from "./banner.model";
import { objectToFormData } from "@/shared/utils/common/formData";

const prefix = "/api/admin/banners";

export const getAllBanners = createAsyncThunk("banner/get-all-banners", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBanner[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBannerById = createAsyncThunk("banner/get-banner-by-id", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBanner[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBannerAllIds = createAsyncThunk("banner/get-banner-all-ids", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBanner[]>(`${prefix}/all-ids`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const createBanner = createAsyncThunk("banner/create-banner", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.post(prefix, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });

export const createBanner = createAsyncThunk("banner/create-banner", async (request: Omit<IBanner, "id">, thunkAPI) => {
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

export const updateBanner = createAsyncThunk("banner/update-banner", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as IBanner);
    formData.append("_method", "PUT");

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

export const deleteBanner = createAsyncThunk("banner/delete-banner", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusBanner = createAsyncThunk("banner/change-status-banner", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
