import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../redux/store'; // Adjust the import path as necessary

interface User {
  user_id: number;
  user_name: string;
  active: number;
  last_activity_at: string;
  company_count: string;
  driver_count: string;
  vehicle_count: string;
  total_spend: string;
}

interface BillingReportResponse {
  filter: string;
  from: string;
  to: string;
  users: User[];
}

interface BillingReportState {
  data: BillingReportResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingReportState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchBillingReport = createAsyncThunk(
  'billingReport/fetchReport',
  async (params: { filter: string; from: string; to: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token; // Assuming you have auth token in your store
      
      const response = await axios.get<BillingReportResponse>(
        'https://wasl-api.tracking.me/api/admin/billing-report-customer',
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please login again.');
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch billing report');
    }
  }
);

const billingReportSlice = createSlice({
  name: 'billingReport',
  initialState,
  reducers: {
    clearBillingReport: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBillingReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch billing report';
      });
  },
});

export const { clearBillingReport } = billingReportSlice.actions;
export const selectBillingReport = (state: RootState) => state.billingReport;

export default billingReportSlice.reducer;