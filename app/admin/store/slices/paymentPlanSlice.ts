// store/slices/paymentPlanSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { BillingPlan } from '../../types/billingPlan';

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
      console.log("Fetch Billing Plans API Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Billing Plan
export const updateBillingPlan = createAsyncThunk<
  any,
  { id: string; data: Partial<BillingPlan> },
  { state: { auth: { token: string | null } } }
>(
  'billingPlans/updateBillingPlan',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      // Remove id from data before sending to API
      const { id: _id, ...payload } = data;
      const response = await axios.put(
        `https://wasl-api.tracking.me/api/admin/payment_plan/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log("Update Billing Plan API Response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Billing Plan
export const createBillingPlan = createAsyncThunk<
  any,
  Partial<BillingPlan>,
  { state: { auth: { token: string | null } } }
>(
  'billingPlans/createBillingPlan',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      const response = await axios.post(
        'https://wasl-api.tracking.me/api/admin/payment_plan',
        data,
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
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Billing Plan
export const deleteBillingPlan = createAsyncThunk<
  any,
  string,
  { state: { auth: { token: string | null } } }
>(
  'billingPlans/deleteBillingPlan',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      const response = await axios.delete(
        `https://wasl-api.tracking.me/api/admin/payment_plan/${id}`,
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
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Invoices
export const fetchInvoices = createAsyncThunk<
  any,
  { page?: number },
  { state: { auth: { token: string | null } } }
>(
  'invoices/fetchInvoices',
  async ({ page = 1 } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/invoices?page=${page}`,
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
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const paymentPlanSlice = createSlice({
  name: 'paymentPlan',
  initialState: {
    dashboardData: null as any,
    billingPlans: [] as any[],
    invoices: [] as any[],
    invoicesPaging: null as any,
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
        // Map API response to BillingPlan[] for UI
        state.billingPlans = (action.payload || []).map((plan: any) => ({
          id: plan.id?.toString() ?? '',
          name: plan.name ?? '',
          description: plan.description ?? '',
          companyApiPrice: plan.company_calls ?? 0,
          driverApiPrice: plan.driver_calls ?? 0,
          vehicleApiPrice: plan.vehicle_calls ?? 0,
          locationApiPrice: plan.location_calls ?? plan.locationApiPrice ?? 0, // ensure locationApiPrice is set
          isActive: plan.isActive ?? true, // fallback, adjust as needed
          price: plan.price ?? 0, // if you want to use price
        }));
      })
      .addCase(fetchBillingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Billing Plan
      .addCase(updateBillingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillingPlan.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update billingPlans in state
      })
      .addCase(updateBillingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Billing Plan
      .addCase(createBillingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBillingPlan.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add the new plan to billingPlans
        state.billingPlans.push(action.payload.data || action.payload);
      })
      .addCase(createBillingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Billing Plan
      .addCase(deleteBillingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBillingPlan.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove the deleted plan from billingPlans
        state.billingPlans = state.billingPlans.filter(plan => plan.id !== action.meta.arg);
      })
      .addCase(deleteBillingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data || [];
        state.invoicesPaging = action.payload.paging || null;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
