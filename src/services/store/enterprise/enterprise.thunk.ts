import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IEnterprise } from "./enterprise.model";
import { IIndustry } from "../industry/industry.model";
import { objectToFormData } from "@/shared/utils/common/formData";

const prefix = "/api/admin/enterprises";

//get-all-enterprises
export const getAllEnterprise = createAsyncThunk("staff/get-all-enterprises", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEnterprise[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

//list-enterprises
export const getListEnterprise = createAsyncThunk("staff/get-list-enterprises", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEnterprise[]>("/api/admin/list-enterprises");
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// get-enterprise-of-bidding-result-by-project
export const getEnterpriseById = createAsyncThunk("enterprises/get-enterprises-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEnterprise>(`/api/admin/get-enterprise-of-bidding-result-by-project/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getEnterpriseOfBiddingResultByProject = createAsyncThunk("enterprises/get-enterprise-of-bidding-result-by-project", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IEnterprise>(`/api/admin/get-enterprise-of-bidding-result-by-project/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createEnterprise = createAsyncThunk("enterprises/create-enterprises", async (request: Omit<IEnterprise, "id">, thunkAPI) => {
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
export const updateEnterprise = createAsyncThunk("enterprises/update-enterprises", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as IEnterprise);

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
// export const updateEnterprise = createAsyncThunk("enterprises/update-enterprises", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.put(`${prefix}/${payload?.param}`, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });

export const deleteEnterprise = createAsyncThunk("enterprises/delete-enterprises", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
// export const changeStatusEnterprise = createAsyncThunk("enterprises/change-status-enterprises", async (id: string, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
//     return response.status >= 400 ? rejectWithValue(data) : id;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
export const getIndustries = createAsyncThunk("enterprises/get-list-industries", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IIndustry[]>(`${prefix}/list`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusEnterprise = createAsyncThunk("staff/change-status-enterprises", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(`${prefix}/ban/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusActiveEnterprise = createAsyncThunk("staff/change-status-active-enterprises", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.put(`${prefix}/${id}/changeActive`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
