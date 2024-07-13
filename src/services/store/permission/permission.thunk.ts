import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPermission } from "./permission.model";

const prefix = "/api/permissions";

export const getAllPermissions = createAsyncThunk("permission/get-all-permissions", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IPermission[]>(prefix);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getAllModules = createAsyncThunk("permission/get-all-modules", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<string[]>(prefix + "/modules");
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});