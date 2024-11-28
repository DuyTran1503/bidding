import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IError } from "@/shared/interface/error";
import { IProject } from "../project/project.model";

const prefix = "/api/admin/projects/get-list-project/by-staff";

export const getProjectApprovalByStaff = createAsyncThunk("projects/get-list-project/by-staff", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IProject[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
