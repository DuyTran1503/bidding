import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IReputation } from "./reputation.model";
import { getAllReputations, getListReputations, getReputationById } from "./reputation.thunk";
export interface IReputationInitialState extends IInitialState {
  reputations: IReputation[];
  reputation?: IReputation | any;
  listIntroductions: IReputation[];
}

const initialState: IReputationInitialState = {
  status: EFetchStatus.IDLE,
  reputations: [],
  listIntroductions: [],
  reputation: undefined,
  message: "",
  error: undefined,
  filter: {
    size: 10,
    page: 1,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const reputationSlice = createSlice({
  name: "reputation",
  initialState,
  reducers: {
    ...commonStaticReducers<IReputationInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {

    // get all
    builder
      .addCase(getAllReputations.fulfilled, (state, { payload }: PayloadAction<IResponse<IReputation[]> | any>) => {
        if (payload.data) {
          state.reputations = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllReputations.rejected, (state, { payload }: PayloadAction<IResponse<IReputation[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });

      // get by id
    builder
      .addCase(getReputationById.fulfilled, (state, { payload }: PayloadAction<IReputation[]> | any) => {
        state.reputation = payload.data;
        state.loading = false;
      })
      .addCase(getReputationById.rejected, (state, { payload }: PayloadAction<IReputation> | any) => {
        state.reputation = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
      
    // get list
    builder
      .addCase(getListReputations.fulfilled, (state, { payload }: PayloadAction<IResponse<IReputation[]> | any>) => {
        if (payload.data) {
          state.listIntroductions = payload.data;
        }
      })
      .addCase(getListReputations.rejected, (state, { payload }: PayloadAction<IResponse<IReputation[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter, fetching, resetMessageError } = reputationSlice.actions;
export { reputationSlice };
