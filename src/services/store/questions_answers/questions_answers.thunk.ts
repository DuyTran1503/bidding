import { client } from "@/services/config/client";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IError } from "@/shared/interface/error";
import { IQuestionsAnswers } from "./questions_answers.model";

const prefix = "/api/admin/questions-answers";

export const getAllQuestionsAnswers = createAsyncThunk("staff/get-all-questions-answers", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IQuestionsAnswers[]>(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getQuestionAnswerById = createAsyncThunk("questions-answers/get-questions-answers-by-id", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get<IQuestionsAnswers>(prefix + `/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const createQuestionAnswer = createAsyncThunk("questions-answers/create-questions-answers", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.post(prefix, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data as IError);
  }
});

export const updateQuestionAnswer = createAsyncThunk("questions-answers/update-questions-answers", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { response, data } = await client.patch(`${prefix}/${payload.param}`, payload);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteQuestionAnswer = createAsyncThunk("questions-answers/delete-questions-answers", async (id: string, { rejectWithValue }) => {
  try {
    const { response, data } = await client.delete(`${prefix}/${id}`);
    return response.status >= 400 ? rejectWithValue(data) : id;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const changeStatusQuestionAnswer = createAsyncThunk(
  "questions-answers/change-status-questions-answers",
  async (id: string, { rejectWithValue }) => {
    try {
      const { response, data } = await client.patch(`${prefix}/${id}/toggle-status`);
      return response.status >= 400 ? rejectWithValue(data) : id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const getListQuestionAnswers = createAsyncThunk("questions-answers/get-list-questions-answers", async (_, { rejectWithValue }) => {
  try {
    const { response, data } = await client.get(`/api/admin/list-questions-answers`);
    return response.status >= 400 ? rejectWithValue(data) : data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
