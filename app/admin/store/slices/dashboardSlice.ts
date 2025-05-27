import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface ApiUsage {
  allowed: number;
  used: number;
  remaining: number;
}

interface ApiUsageSummaryDetail {
  api: string;
  calls: string;
}

interface Invoice {
  customer: string;
  amount: string;
}

interface Activity {
  action: string;
  time: string;
}

interface DashboardState {
  companies_count: number;
  drivers_count: number;
  vehicles_count: number;
  users_count: number;
  api_calls: {
    driver: ApiUsage;
    company: ApiUsage;
    vehicle: ApiUsage;
  };
  api_usage_summary: {
    title: string;
    total_api_calls: string;
    details: ApiUsageSummaryDetail[];
  };
  pending_invoices: {
    title: string;
    count: number;
    invoices: Invoice[];
  };
  monthly_revenue: {
    title: string;
    amount: string;
  };
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  companies_count: 0,
  drivers_count: 0,
  vehicles_count: 0,
  users_count: 0,
  api_calls: {
    driver: { allowed: 0, used: 0, remaining: 0 },
    company: { allowed: 0, used: 0, remaining: 0 },
    vehicle: { allowed: 0, used: 0, remaining: 0 },
  },
  api_usage_summary: {
    title: '',
    total_api_calls: '',
    details: [],
  },
  pending_invoices: {
    title: '',
    count: 0,
    invoices: [],
  },
  monthly_revenue: {
    title: '',
    amount: '',
  },
  activities: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { getState, rejectWithValue }) => {
    const state: any = getState();
    const token = state.auth.token;
console.log('Fetching dashboard data with token:', token);
    try {
      const response = await axios.get('https://wasl-api.tracking.me/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
console.log('Dashboard data fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  builder
    .addCase(fetchDashboardData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchDashboardData.fulfilled, (state, action) => {
      const data = action.payload.data; // check `.data` or no `.data`
      state.companies_count = data.companies_count;
      state.drivers_count = data.drivers_count;
      state.vehicles_count = data.vehicles_count;
      state.users_count = data.users_count;
      state.api_calls = data.api_calls;
      state.api_usage_summary = data.api_usage_summary;
      state.pending_invoices = data.pending_invoices;
      state.monthly_revenue = data.monthly_revenue;
      state.activities = data.activities;
      state.loading = false;
    })
    .addCase(fetchDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
}

});

export default dashboardSlice.reducer;
