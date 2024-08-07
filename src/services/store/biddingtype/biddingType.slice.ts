import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBiddingType } from "./biddingType.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { getAllBiddingTypes, createBiddingType, updateBiddingType, deleteBiddingType } from "./biddingType.thunk";

export interface IBiddingTypeInitialState extends IInitialState {
  biddingTypes: IBiddingType[];
  activeBiddingType: IBiddingType | undefined;
}

const initialState: IBiddingTypeInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  biddingTypes: [],
  activeBiddingType: undefined,
  totalRecords: 0,
  filter: {
    size: 10,
    page: 1,
  },
};

const biddingTypeSlice = createSlice({
  name: "biddingType",
  initialState,
  reducers: {
    ...commonStaticReducers<IBiddingTypeInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding fields
    builder.addCase(getAllBiddingTypes.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingType[]> | any>) => {
      if (payload.data) {
        state.biddingTypes = payload.data.biddingTypes;
        state.totalRecords = payload.totalDocs || 0;
      }
    });
    // ? Create bidding field
    builder
      .addCase(createBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBiddingType.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingType> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Created successfully";
        if (payload.data) {
          state.biddingTypes.push(payload.data);
        }
      })
      .addCase(createBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Creation failed";
      });
    // ? Update bidding field
    builder
      .addCase(updateBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBiddingType.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingType> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Updated successfully";
        if (payload.data) {
          const index = state.biddingTypes.findIndex((field) => field.id === payload.data.id);
          if (index !== -1) {
            state.biddingTypes[index] = payload.data;
          }
        }
      })
      .addCase(updateBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Update failed";
      });
    // ? Delete bidding field
    builder
      .addCase(deleteBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBiddingType.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Deleted successfully";
        state.biddingTypes = state.biddingTypes.filter((field) => field.id !== payload);
      })
      .addCase(deleteBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Deletion failed";
      });
  },
});

export const { resetStatus, setFilter } = biddingTypeSlice.actions;
export { biddingTypeSlice };
