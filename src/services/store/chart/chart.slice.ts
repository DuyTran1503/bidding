// chart.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IChart } from "./chart.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { 
  averageProjectPurationByIndustry, 
  employeeEducationLevelStatisticByEnterprise, 
  industryHasTheMostEnterprise, 
  industryHasTheMostProject, 
  projectByDomestic, 
  projectByFundingsource, 
  projectByIndustry, 
  projectByOrganizationType, 
  projectBySelectionMethod, 
  projectBySubmissionMethod, 
  projectByTendererInvestor, 
  projectsStatusPreMonth, 
  timeJoiningWebsiteOfEnterprise, 
  topEnterprisesHaveCompletedProjectsByFundingSource, 
  topEnterprisesHaveCompletedProjectsByIndustry, 
  topInvestorsByProjectFull, 
  topInvestorsByProjectPartial, 
  topInvestorsByProjectTotalAmount, 
  topTendersByProjectCount,
  topTendersByProjectTotalAmount
} from "./chart.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { commonStaticReducers } from '@/services/shared';

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
  topEnterprisesHaveCompletedProjectsByFundingSource: IChart[];
  topEnterprisesHaveCompletedProjectsByIndustry: IChart[];
  timeJoiningWebsiteOfEnterprise: IChart[] | any;
  projectsStatusPreMonth: IChart | any;
  industryHasTheMostProject: IChart[];
  industryHasTheMostEnterprise: IChart[];
}

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
  topEnterprisesHaveCompletedProjectsByFundingSource: [],
  topEnterprisesHaveCompletedProjectsByIndustry: [],
  timeJoiningWebsiteOfEnterprise: [],
  projectsStatusPreMonth: undefined,
  industryHasTheMostProject: [],
  industryHasTheMostEnterprise: [],

  totalRecords: 0,
  filter: {
    size: 10,
    page: 1,
  },
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {...commonStaticReducers<IChartInitialState>()},
  extraReducers: (builder) => {
    const pendingReducer = (state: IChartInitialState) => {
      state.status = EFetchStatus.PENDING;
    };

    const fulfilledReducer = (state: IChartInitialState, payload: any, message: string, key: keyof IChartInitialState) => {
      state.status = EFetchStatus.FULFILLED;
      state.message = message;
      if (payload) {
        state[key] = payload;
      }
    };

    const rejectedReducer = (state: IChartInitialState, payload: any) => {
      state.status = EFetchStatus.REJECTED;
      state.message = transformPayloadErrors(payload?.errors);
    };

    // chart project-by-fundingsource
    builder.addCase(projectByIndustry.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.industryData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectByIndustry.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // chart project-by-fundingsource
    .addCase(projectByFundingsource.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.fundingData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectByFundingsource.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart project-by-domestic
    .addCase(projectByDomestic.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.domesticData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectByDomestic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart project-by-submission-method
    .addCase(projectBySubmissionMethod.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.submissionData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectBySubmissionMethod.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart project-by-selection-method
    .addCase(projectBySelectionMethod.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.selectionData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectBySelectionMethod.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })
    
    // chart project-by-tenderer-investor
    .addCase(projectByTendererInvestor.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.tendererData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectByTendererInvestor.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })
    
    // chart project-by-organization-type
    .addCase(projectByOrganizationType.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.organizationData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectByOrganizationType.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })
    
    // chart average-project-duration-by-industry
    .addCase(averageProjectPurationByIndustry.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.durationData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(averageProjectPurationByIndustry.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })
    
      // ? Get By ID
      .addCase(
        employeeEducationLevelStatisticByEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IChart> | any>) => {
        state.employeeEducationLevelStatisticByEnterprise = payload.data;
        state.loading = false;
      })

    // chart top-tenderers-by-project-count
    .addCase(topTendersByProjectCount.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.toptenderersbyprojectcountData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(topTendersByProjectCount.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart top-tenderers-by-project-total-amount
    .addCase(topTendersByProjectTotalAmount.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.toptenderersbyprojecttotalamountData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(topTendersByProjectTotalAmount.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart top-investors-by-project-partial
    .addCase(topInvestorsByProjectPartial.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.topinvestorsbyprojectpartialData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(topInvestorsByProjectPartial.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart top-investors-by-project-full
    .addCase(topInvestorsByProjectFull.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.topinvestorsbyprojectfullData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(topInvestorsByProjectFull.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // chart top-investors-by-total-amount
    .addCase(topInvestorsByProjectTotalAmount.fulfilled, (state, { payload }: PayloadAction<IChart[]>) => {
      state.topinvestorsbyprojecttotalamountData = payload;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(topInvestorsByProjectTotalAmount.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = action.payload as string || "Có lỗi xảy ra khi tải dữ liệu";
    })

    // top-enterprises-have-completed-projects-by-funding-source/{fundingSource?}
    .addCase(topEnterprisesHaveCompletedProjectsByFundingSource.pending, pendingReducer)
    .addCase(topEnterprisesHaveCompletedProjectsByFundingSource.fulfilled, (state, { payload }) => 
      fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'topEnterprisesHaveCompletedProjectsByFundingSource'))
    .addCase(topEnterprisesHaveCompletedProjectsByFundingSource.rejected, (state, { payload }) => rejectedReducer(state, payload))

    // top-enterprises-have-completed-projects-by-industry
    .addCase(topEnterprisesHaveCompletedProjectsByIndustry.pending, pendingReducer)
    .addCase(topEnterprisesHaveCompletedProjectsByIndustry.fulfilled, (state, { payload }) => 
      fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'topEnterprisesHaveCompletedProjectsByIndustry'))
    .addCase(topEnterprisesHaveCompletedProjectsByIndustry.rejected, (state, { payload }) => rejectedReducer(state, payload))

    // time-joining-website-of-enterprise
    .addCase(timeJoiningWebsiteOfEnterprise.pending, pendingReducer)
    .addCase(timeJoiningWebsiteOfEnterprise.fulfilled, (state, { payload }) => 
      fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'timeJoiningWebsiteOfEnterprise'))
    .addCase(timeJoiningWebsiteOfEnterprise.rejected, (state, { payload }) => rejectedReducer(state, payload))

// projects-status-per-month
    .addCase(projectsStatusPreMonth.pending, pendingReducer)
    .addCase(projectsStatusPreMonth.fulfilled, (state, { payload }) => 
      fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'projectsStatusPreMonth'))
    .addCase(projectsStatusPreMonth.rejected, (state, { payload }) => rejectedReducer(state, payload))

// industry-has-the-most-project
    .addCase(industryHasTheMostProject.pending, pendingReducer)
    .addCase(industryHasTheMostProject.fulfilled, (state, { payload }) => 
      fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'industryHasTheMostProject'))
    .addCase(industryHasTheMostProject.rejected, (state, { payload }) => rejectedReducer(state, payload))

    // industry-has-the-most-enterprise
    .addCase(industryHasTheMostEnterprise.pending, pendingReducer)
    .addCase(industryHasTheMostEnterprise.fulfilled, (state, { payload }) => 
      fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'industryHasTheMostEnterprise'))
    .addCase(industryHasTheMostEnterprise.rejected, (state, { payload }) => rejectedReducer(state, payload))

  },
});

export const { resetStatus, setFilter } = chartSlice.actions;
export { chartSlice };
