import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFundingSource } from "./funding_source.model";

const prefix = "/api/fundingsources";

export const getAllFundingSources = createAsyncThunk("funding_source/get-all-funding_sources", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFundingSource>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const getFundingSourceById = createAsyncThunk("funding_source/get-funding_sources-by-id", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFundingSource>(prefix +  `/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const createFundingSource = createAsyncThunk("funding_source/create-funding_source", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.post<IFundingSource[]>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const updateFundingSource = createAsyncThunk("funding_source/update-funding_source", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.patch<IFundingSource[]>(`${prefix}/${payload.param}`, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const deleteFundingSources = createAsyncThunk("funding_source/delete-funding_source", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.delete(`${prefix}/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});