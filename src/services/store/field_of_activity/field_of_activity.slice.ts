import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IFieldOfActivity } from "./field_of_activity.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
// eslint-disable-next-line max-len
import { createFieldOfActivity, deleteFieldOfActivitys, getAllFieldOfActivitys, getFieldOfActivityById, updateFieldOfActivity } from "./field_of_activity.thunk";

export interface IFieldOfActivityInitialState extends IInitialState {
    fieldofactivity: IFieldOfActivity[];
    activeFieldOfActivity: IFieldOfActivity | undefined;
}

const initialState: IFieldOfActivityInitialState = {
    status: EFetchStatus.IDLE,
    message: "",
    fieldofactivity: [],
    activeFieldOfActivity: undefined,
    totalRecords: 0,
    filter: {
        size: 10,
        page: 1,
    },
}

const  fieldofactivitySlice = createSlice({
    name: "fieldofactivity",
    initialState,
    reducers: {
        ...commonStaticReducers<IFieldOfActivityInitialState>(),
    },
    extraReducers(builder) {
        
        builder.addCase(getAllFieldOfActivitys.fulfilled, (state, { payload }: PayloadAction<IResponse<IFieldOfActivity | any>>) => {
            state. fieldofactivitys = payload?.data?.data;
          });

        builder.addCase(getFieldOfActivityById.fulfilled, (state, { payload }: PayloadAction<IResponse<IFieldOfActivity>>) => {
            state.activeFieldOfActivity = payload.data;
        })

        // create 
        builder
            .addCase(createFieldOfActivity.pending, (state) => {
                state.status = EFetchStatus.PENDING;
            })
            .addCase(createFieldOfActivity.fulfilled, (state) => {
                state.status = EFetchStatus.FULFILLED;
                state.message = "Created successfully"
            })
            .addCase(createFieldOfActivity.rejected, (state) => {
                state.status = EFetchStatus.REJECTED;
                state.message = "Created failed"
            })

        // update
         builder
            .addCase(updateFieldOfActivity.pending, (state) => {
                state.status = EFetchStatus.PENDING;
            })
            .addCase(updateFieldOfActivity.fulfilled, (state) => {
                state.status = EFetchStatus.FULFILLED;
                state.message = "Created successfully"
            })
            .addCase(updateFieldOfActivity.rejected, (state) => {
                state.status = EFetchStatus.REJECTED;
                state.message = "Created failed"
            })

        // delete
        builder
        .addCase(deleteFieldOfActivitys.pending, (state) => {
            state.status = EFetchStatus.PENDING;
        })
        .addCase(deleteFieldOfActivitys.fulfilled, (state) => {
            state.status = EFetchStatus.FULFILLED;
            state.message = "Created successfully"
        })
        .addCase(deleteFieldOfActivitys.rejected, (state) => {
            state.status = EFetchStatus.REJECTED;
            state.message = "Created failed"
        })
    },

})
export const { resetStatus, setFilter } = fieldofactivitySlice.actions;
export {fieldofactivitySlice}