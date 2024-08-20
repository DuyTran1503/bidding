import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFieldOfActivity } from "./field_of_activity.model";

const prefix = "";

// eslint-disable-next-line max-len
export const getAllFieldOfActivitys = createAsyncThunk("field-of-activity/get-all-field-of-activity", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFieldOfActivity>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const getFieldOfActivityById = createAsyncThunk("field-of-activity/get-field-of-activitys-by-id", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFieldOfActivity>(prefix +  `/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

// eslint-disable-next-line max-len
export const createFieldOfActivity = createAsyncThunk("field-of-activity/create-field-of-activity", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.post<IFieldOfActivity[]>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

// eslint-disable-next-line max-len
export const updateFieldOfActivity = createAsyncThunk("field-of-activity/update-field-of-activity", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.patch<IFieldOfActivity[]>(`${prefix}/${payload.param}`, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const deleteFieldOfActivitys = createAsyncThunk("field-of-activity/delete-field-of-activity", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.delete(`${prefix}/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});