import { client } from "@/services/config/client";
import { objectToFormData } from "@/shared/utils/common/formData";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBidDocument } from "./bid_document.model";

const prefix = "/api/admin/bid-documents";

export const getAllBidDocument = createAsyncThunk("staff/get-all-bid-documents", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidDocument[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getBidDocumentById = createAsyncThunk("bid_document/get-bid-documents-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IBidDocument>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const createBidDocument = createAsyncThunk("bid_document/create-bid-documents", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.post(prefix, payload);

//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data as IError);
//   }
// });
export const createBidDocument = createAsyncThunk("bid_document/create-bid-documents", async (request: Omit<IBidDocument, "id">, thunkAPI) => {
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
// export const updateBidDocument = createAsyncThunk("bid_document/update-bid-documents", async (payload: IThunkPayload, { rejectWithValue }) => {
//   try {
//     const { response, data } = await client.patch(`${prefix}/${payload?.param}`, payload);
//     return response.status >= 400 ? rejectWithValue(data) : data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });
export const updateBidDocument = createAsyncThunk("bid_document/update-bid-documents", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as IBidDocument);

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
export const deleteBidDocument = createAsyncThunk("bid_document/delete-bid-documents", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusBidDocument = createAsyncThunk("bid_document/change-status-bid-documents", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getListBidDocument = createAsyncThunk("bid_document/get-list-bid-documents", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-bid-documents`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
