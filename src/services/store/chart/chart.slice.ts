// chart.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IChart } from "./chart.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { 
  averageProjectPurationByIndustry, 
  employeeEducationLevelStatisticByEnterprise, 
  projectByDomestic, 
  projectByFundingsource, 
  projectByIndustry, 
  projectByOrganizationType, 
  projectBySelectionMethod, 
  projectBySubmissionMethod, 
  projectByTendererInvestor, 
  topInvestorsByProjectFull, 
  topInvestorsByProjectPartial, 
  topInvestorsByProjectTotalAmount, 
  topTendersByProjectCount,
  topTendersByProjectTotalAmount
} from "./chart.thunk";

export interface IChartInitialState extends IInitialState {
  industryData: IChart[]; // Dữ liệu biểu đồ theo ngành
  fundingData: IChart[];
  domesticData: IChart[];
  submissionData: IChart[];
  selectionData: IChart[];
  tendererData: IChart[];
  organizationData: IChart[];
  durationData: IChart[];
  employeeEducationLevelStatisticByEnterprise: IChart | any;
  toptenderersbyprojectcountData: IChart[];
  toptenderersbyprojecttotalamountData: IChart[];
  topinvestorsbyprojectpartialData: IChart[];
  topinvestorsbyprojectfullData: IChart[];
  topinvestorsbyprojecttotalamountData: IChart[];
}

// chart project-by-submission-method
// chart project-by-selection-method
// chart project-by-tenderer-investor
// chart project-by-organization-type
// chart average-project-duration-by-industry

const initialState: IChartInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  industryData: [],
  fundingData: [],
  domesticData: [],
  submissionData: [],
  selectionData: [],
  tendererData: [],
  organizationData: [],
  durationData: [],
  employeeEducationLevelStatisticByEnterprise: undefined,
  toptenderersbyprojectcountData:[],
  toptenderersbyprojecttotalamountData:[],
  topinvestorsbyprojectpartialData: [],
  topinvestorsbyprojectfullData: [],
  topinvestorsbyprojecttotalamountData: [],

  totalRecords: 0,
  filter: {
    size: 10,
    page: 1,
  },
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // chart project-by-fundingsource
    builder.addCase(projectByIndustry.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.industryData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectByIndustry.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart project-by-fundingsource
    builder.addCase(projectByFundingsource.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.fundingData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectByFundingsource.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart project-by-domestic
    builder.addCase(projectByDomestic.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.domesticData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectByDomestic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart project-by-submission-method
    builder.addCase(projectBySubmissionMethod.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.submissionData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectBySubmissionMethod.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart project-by-selection-method
    builder.addCase(projectBySelectionMethod.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.selectionData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectBySelectionMethod.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });
    
    // chart project-by-tenderer-investor
    builder.addCase(projectByTendererInvestor.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.tendererData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectByTendererInvestor.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });
    
    // chart project-by-organization-type
    builder.addCase(projectByOrganizationType.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.organizationData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(projectByOrganizationType.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });
    
    // chart average-project-duration-by-industry
    builder.addCase(averageProjectPurationByIndustry.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.durationData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(averageProjectPurationByIndustry.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });
    
      // ? Get By ID
      builder
      .addCase(
        employeeEducationLevelStatisticByEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IChart> | any>) => {
        state.employeeEducationLevelStatisticByEnterprise = payload.data;
        state.loading = false;
      })
      // .addCase(
      //   employeeEducationLevelStatisticByEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IChart> | any>) => {
      //   state.employeeEducationLevelStatisticByEnterprise = payload.data;
      //   state.message = transformPayloadErrors(payload?.errors);
      //   state.loading = false;
      // });

    // chart top-tenderers-by-project-count
    builder.addCase(topTendersByProjectCount.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.toptenderersbyprojectcountData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(topTendersByProjectCount.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart top-tenderers-by-project-total-amount
    builder.addCase(topTendersByProjectTotalAmount.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.toptenderersbyprojecttotalamountData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(topTendersByProjectTotalAmount.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart top-investors-by-project-partial
    builder.addCase(topInvestorsByProjectPartial.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.topinvestorsbyprojectpartialData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(topInvestorsByProjectPartial.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart top-investors-by-project-full
    builder.addCase(topInvestorsByProjectFull.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.topinvestorsbyprojectfullData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(topInvestorsByProjectFull.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });

    // chart top-investors-by-total-amount
    builder.addCase(topInvestorsByProjectTotalAmount.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.topinvestorsbyprojecttotalamountData = payload;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(topInvestorsByProjectTotalAmount.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    });
  },
});

export { chartSlice };
