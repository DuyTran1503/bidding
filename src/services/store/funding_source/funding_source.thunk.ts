import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFundingSource } from "./funding_source.model";

const prefix = "http://localhost:4000/funding_sources";

export const getAllFundingSources = createAsyncThunk("funding-source/get-all-funding-sources", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFundingSource>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const getFundingSourceById = createAsyncThunk("funding-source/get-funding-sources-by-id", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.get<IFundingSource>(prefix +  `/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const createFundingSource = createAsyncThunk("funding-source/create-funding-source", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.post<IFundingSource[]>(prefix, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const updateFundingSource = createAsyncThunk("funding-source/update-funding-source", async(payload: IThunkPayload, { rejectWithValue }) => {
    try {
        const {response, data} = await client.patch<IFundingSource[]>(`${prefix}/${payload.param}`, payload);
        return response.status >= 400 ? rejectWithValue(data) : data;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});

export const deleteFundingSources = createAsyncThunk("funding-source/delete-funding-source", async(id: string, { rejectWithValue }) => {
    try {
        const {response, data} = await client.delete(`${prefix}/${id}`);
        return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
        return rejectWithValue(error.response.data); 
    }
});