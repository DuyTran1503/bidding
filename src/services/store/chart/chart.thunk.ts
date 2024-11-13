// chart.thunk.ts
import { client } from "@/services/config/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IThunkPayload } from "@/shared/utils/shared-interfaces";
import { IChart } from "./chart.model";

const prefix = "/api/admin/dashboard/charts";
const prefix_second = "/api/admin/charts";

// chart project-by-industry
export const projectByIndustry = createAsyncThunk("chart/project-by-industry", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.get<IChart[]>(`${prefix}/project-by-industry`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// chart project-by-fundingsource
export const projectByFundingsource = createAsyncThunk("chart/project-by-fundingsource", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.get<IChart[]>(`${prefix}/project-by-fundingsource`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// chart project-by-domestic
export const projectByDomestic = createAsyncThunk("chart/project-by-domestic", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.get<IChart[]>(`${prefix}/project-by-domestic`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// chart project-by-submission-method
export const projectBySubmissionMethod = createAsyncThunk(
  "chart/project-by-submission-method",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-submission-method`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

// chart project-by-selection-method
export const projectBySelectionMethod = createAsyncThunk("chart/project-by-selection-method", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.get<IChart[]>(`${prefix}/project-by-selection-method`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// chart project-by-tenderer-investor
export const projectByTendererInvestor = createAsyncThunk(
  "chart/project-by-tenderer-investor",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-tenderer-investor`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

// chart project-by-organization-type
export const projectByOrganizationType = createAsyncThunk(
  "chart/project-by-organization-type",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/project-by-organization-type`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

// chart average-project-duration-by-industry
export const averageProjectPurationByIndustry = createAsyncThunk(
  "chart/average-project-duration-by-industry",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/average-project-duration-by-industry`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

// chart enterprises/{id}/employee-education-level-statistic-by-enterprise
export const employeeEducationLevelStatisticByEnterprise = createAsyncThunk(
  "chart/employee-education-level-statistic-by-enterprise",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart>(`${prefix_second}/enterprises/${id}/employee-education-level-statistic-by-enterprise`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

export const topTendersByProjectCount = createAsyncThunk(
  "chart/top-tenderers-by-project-count",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/top-tenderers-by-project-count`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);
export const topTendersByProjectTotalAmount = createAsyncThunk(
  "chart/top-tenderers-by-project-total-amount",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/top-tenderers-by-project-total-amount`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);
export const topInvestorsByProjectPartial = createAsyncThunk(
  "chart/top-investors-by-project-partial",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/top-investors-by-project-partial`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);
export const topInvestorsByProjectFull = createAsyncThunk(
  "chart/top-investors-by-project-full",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/top-investors-by-project-full`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);
export const topInvestorsByProjectTotalAmount = createAsyncThunk(
  "chart/top-investors-by-project-total-amount",
  async (payload: IThunkPayload, { rejectWithValue }) => {
    try {
      const { data } = await client.get<IChart[]>(`${prefix}/top-investors-by-project-total-amount`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
    }
  },
);

// top-enterprises-have-completed-projects-by-funding-source/{fundingSource?}
export const topEnterprisesHaveCompletedProjectsByFundingSource = 
createAsyncThunk("topEnterprisesHaveCompletedProjectsByFundingSource", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/top-enterprises-have-completed-projects-by-funding-source`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// top-enterprises-have-completed-projects-by-industry
export const topEnterprisesHaveCompletedProjectsByIndustry = 
createAsyncThunk("topEnterprisesHaveCompletedProjectsByIndustry", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/top-enterprises-have-completed-projects-by-industry`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// time-joining-website-of-enterprise
export const timeJoiningWebsiteOfEnterprise = 
createAsyncThunk("timeJoiningWebsiteOfEnterprise", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/time-joining-website-of-enterprise`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// projects-status-per-month
export const projectsStatusPreMonth = 
createAsyncThunk("projectsStatusPreMonth", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/projects-status-per-month`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// industry-has-the-most-project
export const industryHasTheMostProject = 
createAsyncThunk("industryHasTheMostProject", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/industry-has-the-most-project`, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});

// industry-has-the-most-enterprise
export const industryHasTheMostEnterprise  = 
createAsyncThunk("industryHasTheMostEnterprise ", async (payload: IThunkPayload, { rejectWithValue }) => {
  try {
    const { data } = await client.post(`${prefix}/industry-has-the-most-enterprise `, payload);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Có lỗi xảy ra khi gọi API");
  }
});
