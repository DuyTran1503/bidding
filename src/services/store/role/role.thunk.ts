import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IRole } from "./role.model";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";

const prefix = "/api/admin/role";

export const getAllRoles = createAsyncThunk("role/get-all-roles", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IRole[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getRoleById = createAsyncThunk("role/get-role-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IRole>(prefix + `/${id}/edit`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createRole = createAsyncThunk("role/create-role", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateRole = createAsyncThunk("role/update-role", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.put(`${prefix}/${payload.id}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteRole = createAsyncThunk("role/delete-role", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
export const getAllPermissions = createAsyncThunk("role/get-all-permissions", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IRole[]>(`${prefix}/create`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
