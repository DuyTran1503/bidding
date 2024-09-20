import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { INewProject, IProject } from "./project.model.ts";
import { objectToFormData } from "@/shared/utils/common/formData.ts";

const prefix = "/api/admin/projects";

export const getAllProject = createAsyncThunk("staff/get-all-projects", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IProject[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getProjectById = createAsyncThunk("projects/get-projects-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IProject>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createProject = createAsyncThunk("projects/create-projects", async (request: Omit<INewProject, "id">, thunkAPI) => {
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

export const updateProject = createAsyncThunk("enterprises/update-enterprises", async (payload: IThunkPayload, thunkAPI) => {
  try {
    const formData = objectToFormData(payload.body as INewProject);

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
export const deleteProject = createAsyncThunk("projects/delete-projects", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const changeStatusProject = createAsyncThunk("projects/change-status-projects", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const approveProject = createAsyncThunk("projects/approve-projects", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.put(`${prefix}/${payload.param}/approve`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
