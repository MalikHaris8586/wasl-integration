import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import { createSelector } from '@reduxjs/toolkit';
import { CompanyReport, DriverReport, VehicleReport } from '../../types/report';

interface SummaryItem {
  label: string;
  count?: number;
  description?: string;
  percentage?: string;
}

interface ApiUsageData {
  used: number;
  allowed: number;
  remaining: number;
}

interface ReportUser {
  user_id: number;
  user_name: string;
  company_registered_count?: number;
  Driver_registered_count?: number;
  vehicle_registered_count?: number;
}

interface BaseReport {
  filter: string;
  from: string;
  to: string;
  total: number;
}

interface Customer {
  id: string;
  customerName: string;
  status: 'active' | 'warning' | 'critical';
  companiesLimit: number;
  driversLimit: number;
  vehiclesLimit: number;
  companiesUsed: number;
  driversUsed: number;
  vehiclesUsed: number;
  lastUpdated: string;
}

interface DetailReport extends BaseReport {
  summary: SummaryItem[];
  api_calls: {
    driver: ApiUsageData;
    company: ApiUsageData;
    vehicle: ApiUsageData;
  };
  users?: ReportUser[];
  customers?: Customer[];
}

interface ReportState {
  summary: DetailReport['summary'];
  api_calls: DetailReport['api_calls'];
  overviewData: {
    filter: string;
    from: string;
    to: string;
    data: {
      company: number;
      driver: number;
      vehicle: number;
    };
  } | null;
  companyReport: CompanyReport | null;
  driverReport: DriverReport | null;
  vehiclesReport: VehicleReport | null;
  detailReport: DetailReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  summary: [],
  api_calls: {
    driver: { used: 0, allowed: 0, remaining: 0 },
    company: { used: 0, allowed: 0, remaining: 0 },
    vehicle: { used: 0, allowed: 0, remaining: 0 },
  },
  overviewData: null,
  companyReport: null,
  driverReport: null,
  vehiclesReport: null,
  detailReport: null,
  loading: false,
  error: null,
};
// AssesControl reports cards
export const fetchAccessControlReport = createAsyncThunk(
  'report/fetchAccessControlReport',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      console.log("api token" , token)
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(
        'https://wasl-api.tracking.me/api/admin/access-control-report',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("api response", response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// over view tab
export const fetchOverviewReport = createAsyncThunk(
  'report/fetchOverviewReport',
  async (filter: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/access-control-report-company?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("api response", response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// company tabb
export const fetchCompanyReport = createAsyncThunk(
  'report/fetchCompanyReport',
  async (filter: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      console.log("token",token)
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/access-control-report-company?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("api response", response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// driver tab

export const fetchDriverReport = createAsyncThunk(
  'report/fetchDriverReport',
  async (filter: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/access-control-report-driver?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("driver api response", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// vehical tab

export const fetchVehiclesReport = createAsyncThunk(
  'report/fetchVehiclesReport',
  async (filter: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/access-control-report-vehicle?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("driver api response", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// detail-report

export const fetchDetailReport = createAsyncThunk(
  'report/fetchDetailReport',
  async (filter: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/access-control-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("detail report response", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessControlReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessControlReport.fulfilled, (state, action) => {
        console.log('Reducer payload:', action.payload);
        state.loading = false;
        if (action.payload.summary && Array.isArray(action.payload.summary)) {
          state.summary = action.payload.summary;
        }
        if (action.payload.api_calls) {
          state.api_calls = {
            driver: {
              used: action.payload.api_calls.driver?.used || 0,
              allowed: action.payload.api_calls.driver?.allowed || 0,
              remaining: action.payload.api_calls.driver?.remaining || 0
            },
            company: {
              used: action.payload.api_calls.company?.used || 0,
              allowed: action.payload.api_calls.company?.allowed || 0,
              remaining: action.payload.api_calls.company?.remaining || 0
            },
            vehicle: {
              used: action.payload.api_calls.vehicle?.used || 0,
              allowed: action.payload.api_calls.vehicle?.allowed || 0,
              remaining: action.payload.api_calls.vehicle?.remaining || 0
            }
          };
        }
      })
      .addCase(fetchAccessControlReport.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOverviewReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewReport.fulfilled, (state, action) => {
        state.loading = false;
        state.overviewData = action.payload;
      })
      .addCase(fetchOverviewReport.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCompanyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.companyReport = action.payload;
      })
      .addCase(fetchCompanyReport.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDriverReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverReport.fulfilled, (state, action) => {
        state.loading = false;
        state.driverReport = action.payload;
      })
      .addCase(fetchDriverReport.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchVehiclesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehiclesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.vehiclesReport = {
          filter: action.payload.filter,
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total || 0,
          users: action.payload.users?.map((user: any) => ({
            user_id: user.user_id,
            user_name: user.user_name,
            vehicle_registered_count: user.vehicle_registered_count || user.Driver_registered_count || 0
          })) || []
        };
      })
      .addCase(fetchVehiclesReport.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDetailReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailReport.fulfilled, (state, action) => {
        state.loading = false;
        // Debug log for raw API response
        if (typeof window !== 'undefined') console.log('API detailReport payload:', action.payload);
        state.detailReport = {
          filter: action.payload.filter,
          from: action.payload.from,
          to: action.payload.to,
          total: action.payload.total || 0,
          summary: action.payload.summary || [],
          api_calls: action.payload.api_calls || {
            driver: { used: 0, allowed: 0, remaining: 0 },
            company: { used: 0, allowed: 0, remaining: 0 },
            vehicle: { used: 0, allowed: 0, remaining: 0 }
          },
          customers: action.payload.customers || []
        };
      })
      .addCase(fetchDetailReport.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Memoized selectors with transformations
export const selectSummary = createSelector(
  [(state: RootState) => state.report?.summary],
  (summary): SummaryItem[] => {
    if (!summary) return [];
    return summary.map((item: SummaryItem) => ({
      label: item.label,
      count: item.count || 0,
      description: item.description || '',
      percentage: item.percentage
    }));
  }
);

export const selectApiCalls = createSelector(
  [(state: RootState) => state.report?.api_calls],
  (api_calls): ReportState['api_calls'] => {
    const defaultApiCalls = {
      driver: { used: 0, allowed: 0, remaining: 0 },
      company: { used: 0, allowed: 0, remaining: 0 },
      vehicle: { used: 0, allowed: 0, remaining: 0 },
    };
    
    if (!api_calls) return defaultApiCalls;
    
    return {
      driver: {
        used: api_calls.driver?.used || 0,
        allowed: api_calls.driver?.allowed || 0,
        remaining: api_calls.driver?.remaining || 0
      },
      company: {
        used: api_calls.company?.used || 0,
        allowed: api_calls.company?.allowed || 0,
        remaining: api_calls.company?.remaining || 0
      },
      vehicle: {
        used: api_calls.vehicle?.used || 0,
        allowed: api_calls.vehicle?.allowed || 0,
        remaining: api_calls.vehicle?.remaining || 0
      }
    };
  }
);

export const selectOverviewData = createSelector(
  [(state: RootState) => state.report?.overviewData],
  (overviewData): ReportState['overviewData'] => {
    if (!overviewData) return null;
    return {
      filter: overviewData.filter,
      from: overviewData.from,
      to: overviewData.to,
      data: {
        company: overviewData.data?.company || 0,
        driver: overviewData.data?.driver || 0,
        vehicle: overviewData.data?.vehicle || 0
      }
    };
  }
);

export const selectCompanyReport = createSelector(
  [(state: RootState) => state.report?.companyReport],
  (companyReport): CompanyReport | null => {
    if (!companyReport) return null;
    return {
      filter: companyReport.filter,
      from: companyReport.from,
      to: companyReport.to,
      total: companyReport.total || 0,
      users: companyReport.users?.map((user: ReportUser) => ({
        user_id: user.user_id,
        user_name: user.user_name,
        company_registered_count: user.company_registered_count || 0
      })) || []
    };
  }
);

export const selectDriverReport = createSelector(
  [(state: RootState) => state.report?.driverReport],
  (driverReport): DriverReport | null => {
    if (!driverReport) return null;
    return {
      filter: driverReport.filter,
      from: driverReport.from,
      to: driverReport.to,
      total: driverReport.total || 0,
      users: driverReport.users?.map((user: ReportUser) => ({
        user_id: user.user_id,
        user_name: user.user_name,
        Driver_registered_count: user.Driver_registered_count || 0
      })) || []
    };
  }
);

export const selectVehiclesReport = createSelector(
  [(state: RootState) => state.report?.vehiclesReport],
  (vehiclesReport): VehicleReport | null => {
    if (!vehiclesReport) return null;
    return {
      filter: vehiclesReport.filter,
      from: vehiclesReport.from,
      to: vehiclesReport.to,
      total: vehiclesReport.total || 0,
      users: vehiclesReport.users?.map((user: ReportUser) => ({
        user_id: user.user_id,
        user_name: user.user_name,
        Driver_registered_count: user.Driver_registered_count || 0
      })) || []
    };
  }
);

export const selectDetailReport = createSelector(
  [(state: RootState) => state.report?.detailReport],
  (detailReport): DetailReport | null => {
    if (!detailReport) return null;
    // Debug log for raw customers data
    // @ts-ignore
    if (typeof window !== 'undefined') console.log('Raw customers:', detailReport.customers);
    return {
      filter: detailReport.filter,
      from: detailReport.from,
      to: detailReport.to,
      total: detailReport.total || 0,
      summary: detailReport.summary || [],
      api_calls: detailReport.api_calls || {
        driver: { used: 0, allowed: 0, remaining: 0 },
        company: { used: 0, allowed: 0, remaining: 0 },
        vehicle: { used: 0, allowed: 0, remaining: 0 }
      },
      customers: detailReport.customers?.map((customer: any) => ({
        id: customer.id || customer.customer_id || '',
        customerName: customer.customerName || customer.customer_name || '',
        status: customer.status,
        companiesLimit: customer.companiesLimit ?? customer.companies_limit ?? 0,
        driversLimit: customer.driversLimit ?? customer.drivers_limit ?? 0,
        vehiclesLimit: customer.vehiclesLimit ?? customer.vehicles_limit ?? 0,
        companiesUsed: customer.companiesUsed ?? customer.companies_used ?? 0,
        driversUsed: customer.driversUsed ?? customer.drivers_used ?? 0,
        vehiclesUsed: customer.vehiclesUsed ?? customer.vehicles_used ?? 0,
        lastUpdated: customer.lastUpdated || customer.last_updated || ''
      })) || []
    };
  }
);

export const selectLoading = createSelector(
  [(state: RootState) => state.report?.loading],
  (loading): boolean => loading ?? false
);

export default reportSlice.reducer;
