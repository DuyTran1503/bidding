import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IFundingSource } from "./funding_source.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { createFundingSource, deleteFundingSources, getAllFundingSources, getFundingSourceById, updateFundingSource } from "./funding_source.thunk";

export interface IFundingSourceInitialState extends IInitialState {
    funfingsources: IFundingSource[];
    activeFundingSource: IFundingSource | undefined;
}

const initialState: IFundingSourceInitialState = {
    status: EFetchStatus.IDLE,
    message: "",
    funfingsources: [],
    activeFundingSource: undefined,
    totalRecords: 0,
    filter: {
        size: 10,
        page: 1,
    },
};

const fundingSourceSlice = createSlice({
    name: "fundingsource",
    initialState,
    reducers: {
        ...commonStaticReducers<IFundingSourceInitialState>(),
    },
    extraReducers(builder) {
        
        builder.addCase(getAllFundingSources.fulfilled, (state, { payload }: PayloadAction<IResponse<IFundingSource | any>>) => {
            state.funfingsources = payload?.data?.data;
          });

        builder.addCase(getFundingSourceById.fulfilled, (state, { payload }: PayloadAction<IResponse<IFundingSource>>) => {
            state.activeFundingSource = payload.data;
        })

        // create 
        builder
            .addCase(createFundingSource.pending, (state) => {
                state.status = EFetchStatus.PENDING;
            })
            .addCase(createFundingSource.fulfilled, (state) => {
                state.status = EFetchStatus.FULFILLED;
                state.message = "Created successfully"
            })
            .addCase(createFundingSource.rejected, (state) => {
                state.status = EFetchStatus.REJECTED;
                state.message = "Created failed"
            })

        // update
         builder
            .addCase(updateFundingSource.pending, (state) => {
                state.status = EFetchStatus.PENDING;
            })
            .addCase(updateFundingSource.fulfilled, (state) => {
                state.status = EFetchStatus.FULFILLED;
                state.message = "Created successfully"
            })
            .addCase(updateFundingSource.rejected, (state) => {
                state.status = EFetchStatus.REJECTED;
                state.message = "Created failed"
            })

        // delete
        builder
        .addCase(deleteFundingSources.pending, (state) => {
            state.status = EFetchStatus.PENDING;
        })
        .addCase(deleteFundingSources.fulfilled, (state) => {
            state.status = EFetchStatus.FULFILLED;
            state.message = "Created successfully"
        })
        .addCase(deleteFundingSources.rejected, (state) => {
            state.status = EFetchStatus.REJECTED;
            state.message = "Created failed"
        })
    },
});

export const { resetStatus, setFilter } = fundingSourceSlice.actions;
export {fundingSourceSlice}
