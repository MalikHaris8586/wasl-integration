import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../redux/store';

export interface RevenueReportItem {
  Period: string;
  "Total Revenue": string;
  Customers: number;
  Growth: string;
  "Company API Revenue"?: any;
  "Driver API Revenue"?: any;
  "Vehicle API Revenue"?: string;
  "Location API Revenue"?: string;
}

interface RevenueReportState {
  data: RevenueReportItem[];
  loading: boolean;
  error: string | null;
}

const initialState: RevenueReportState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchRevenueReport = createAsyncThunk(
  'revenueReport/fetchReport',
  async (params: { filter: string; from: string; to: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await axios.get<RevenueReportItem[]>(
        'https://wasl-api.tracking.me/api/admin/revenue-report',
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please login again.');
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch revenue report');
    }
  }
);

const revenueReportSlice = createSlice({
  name: 'revenueReport',
  initialState,
  reducers: {
    clearRevenueReport: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRevenueReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch revenue report';
      });
  },
});

export const { clearRevenueReport } = revenueReportSlice.actions;
export const selectRevenueReport = (state: RootState) => state.revenueReport;

export default revenueReportSlice.reducer;
