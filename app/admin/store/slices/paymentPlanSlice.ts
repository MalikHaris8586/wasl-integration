// store/slices/paymentPlanSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Payment Plan Dashboard
export const fetchPaymentPlanDashboard = createAsyncThunk<
  any,
  void,
  { state: { auth: { token: string | null } } }
>(
  'paymentPlan/fetchDashboard',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No auth token found');
      }

      const response = await axios.get(
        'https://wasl-api.tracking.me/api/admin/payment-plan-dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Server Error');
      } else if (error.request) {
        return rejectWithValue('No response from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Fetch Billing Plans
export const fetchBillingPlans = createAsyncThunk<
  any[],
  void,
  { state: { auth: { token: string | null } } }
>(
  'billingPlans/fetchBillingPlans',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No auth token found');
      }

      const response = await axios.get(
        'https://wasl-api.tracking.me/api/admin/payment_plan',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const paymentPlanSlice = createSlice({
  name: 'paymentPlan',
  initialState: {
    dashboardData: null as any,
    billingPlans: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchPaymentPlanDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentPlanDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchPaymentPlanDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.dashboardData = null;
      })

      // Billing Plans
      .addCase(fetchBillingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.billingPlans = action.payload;
      })
      .addCase(fetchBillingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
