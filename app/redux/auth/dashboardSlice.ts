import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ApiCallsDetail {
  allowed: number;
  used: number;
  remaining: number;
}

interface ApiCalls {
  driver: ApiCallsDetail;
  company: ApiCallsDetail;
  vehicle: ApiCallsDetail;
}

interface ApiUsageDetail {
  api: string;
  calls: string;
}

interface ApiUsageSummary {
  title: string;
  total_api_calls: string;
  details: ApiUsageDetail[];
}

interface PendingInvoice {
  id?: number;
  customer?: string;
  amount?: number;
}

interface PendingInvoices {
  title: string;
  count: number;
  invoices: PendingInvoice[];
}

interface MonthlyRevenue {
  title: string;
  amount: string;
}

interface Activity {
  id?: number;
  action?: string;
  customer?: string;
  time?: string;
}

interface DashboardState {
  companies_count: number;
  drivers_count: number;
  vehicles_count: number;
  users_count: number;
  api_calls: ApiCalls;
  api_usage_summary: ApiUsageSummary;
  pending_invoices: PendingInvoices;
  monthly_revenue: MonthlyRevenue;
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
    title: "API Usage",
    total_api_calls: "0",
    details: [],
  },
  pending_invoices: {
    title: "Pending Invoices",
    count: 0,
    invoices: [],
  },
  monthly_revenue: {
    title: "Revenue This Month",
    amount: "SAR 0.00",
  },
  activities: [],
  loading: false,
  error: null,
};

export const fetchAdminDashboard = createAsyncThunk(
  "dashboard/fetchAdmin",
  async ({ token }: { token: string }, thunkAPI) => {
    try {
      const response = await fetch(
        "https://wasl-api.tracking.me/api/genesis/wasl/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unauthorized or fetch failed");
      }

      const data = await response.json();
      console.log("Admin Dashboard API Response:", data);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Update all values from API
        state.companies_count = action.payload.companies_count;
        state.drivers_count = action.payload.drivers_count;
        state.vehicles_count = action.payload.vehicles_count;
        state.users_count = action.payload.users_count;
        state.api_calls = action.payload.api_calls;
        state.api_usage_summary = action.payload.api_usage_summary;
        state.pending_invoices = action.payload.pending_invoices;
        state.monthly_revenue = action.payload.monthly_revenue;
        state.activities = action.payload.activities || [];
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
