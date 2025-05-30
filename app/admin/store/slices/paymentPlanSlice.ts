import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface Revenue {
  value: number;
  change: string;
}

export interface PaymentPlanState {
  total_revenue: Revenue;
  pending_revenue: Revenue;
  active_customers: {
    value: number;
    change: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PaymentPlanState = {
  total_revenue: {
    value: 0,
    change: "0%"
  },
  pending_revenue: {
    value: 0,
    change: "0%"
  },
  active_customers: {
    value: 0,
    change: 0
  },
  loading: false,
  error: null
};

export const fetchPaymentPlanDashboard = createAsyncThunk(
  'paymentPlan/fetchDashboard',
  async (_, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      console.log('token', token);

      const response = await axios.get('https://wasl-api.tracking.me/api/admin/payment-plan-dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('response', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      return {
        total_revenue: response.data.total_revenue,
        pending_revenue: response.data.pending_revenue,
        active_customers: response.data.active_customers
      };
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
);

const paymentPlanSlice = createSlice({
  name: 'paymentPlan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentPlanDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentPlanDashboard.fulfilled, (state, action) => {
        console.log('Updating state with:', action.payload);
        state.loading = false;
        state.total_revenue = {
          value: action.payload.total_revenue.value || 0,
          change: action.payload.total_revenue.change || '0%'
        };
        state.pending_revenue = {
          value: action.payload.pending_revenue.value || 0,
          change: action.payload.pending_revenue.change || '0%'
        };
        state.active_customers = {
          value: action.payload.active_customers.value || 0,
          change: action.payload.active_customers.change || 0
        };
      })
      .addCase(fetchPaymentPlanDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
        // Reset values on error
        state.total_revenue = initialState.total_revenue;
        state.pending_revenue = initialState.pending_revenue;
        state.active_customers = initialState.active_customers;
      });
  },
});

export default paymentPlanSlice.reducer;

