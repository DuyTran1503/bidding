import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { ITask } from "./task.model";
import { IError } from "@/shared/interface/error";

const prefix = "/api/admin/tasks";

export const getAllTasks = createAsyncThunk("task/get-all-tasks", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ITask[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getTaskById = createAsyncThunk("task/get-task-by-id", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ITask[]>(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getTaskAllIds = createAsyncThunk("task/get-task-all-ids", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<ITask[]>(`${prefix}/all-ids`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const createTask = createAsyncThunk("task/create-task", async (request: Omit<ITask, "id">, thunkAPI) => {
//   try {
//     const formData = objectToFormData(request);

//     const accessToken = client.tokens.accessToken();

//     const response = await fetch(import.meta.env.VITE_API_URL + prefix, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       return thunkAPI.rejectWithValue(error);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.response.data);
//   }
// });
export const createTask = createAsyncThunk("task/create-task", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateTask = createAsyncThunk("task/update-task", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// export const updateTask = createAsyncThunk("task/update-task", async (payload: IThunkPayload, thunkAPI) => {
//   try {
//     const formData = objectToFormData(payload.body as ITask);
//     formData.append("_method", "PUT");

//     const accessToken = client.tokens.accessToken();

//     const response = await fetch(import.meta.env.VITE_API_URL + prefix, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       return thunkAPI.rejectWithValue(error);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.response.data);
//   }
// });

export const deleteTask = createAsyncThunk("task/delete-task", async (id: number | string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
