import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { ISystem } from "./system.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getSystems, 
  getSystem, 
  updateSystem, 
} from "./system.thunk";
import { IError } from '@/shared/interface/error';
import { transformPayloadErrors } from '@/shared/utils/common/function';

export interface ISystemInitialState extends IInitialState {
  system: ISystem | any;
  systems: ISystem | any;
}

const initialState: ISystemInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  system: undefined,
  systems: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    ...commonStaticReducers<ISystemInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all System
    builder.addCase(getSystem.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.system = payload.data;
      }
  });

    builder.addCase(getSystems.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.systems = payload.data;
      }
  });

    // ? Update System
    builder
      .addCase(updateSystem.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateSystem.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        
      })
      .addCase(updateSystem.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    }
});

export const { resetStatus, setFilter } = systemSlice.actions;
export { systemSlice };
