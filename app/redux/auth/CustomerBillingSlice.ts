import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchBillingUsage = createAsyncThunk(
  'billing/fetchBillingUsage',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get token from Redux state
      const state: any = getState();
      const token = state.auth?.token;
      console.log('Fetching billing usage with token:', token)
      // Check if token exists
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      const response = await axios.get('https://wasl-api.tracking.me/api/billing-usage', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Billing usage response:', response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch billing usage')
    }
  }
)

// New thunk for fetching invoices
export const fetchInvoices = createAsyncThunk(
  'billing/fetchInvoices',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      console.log('Fetching invoices with token:', token)   
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      const response = await axios.get('https://wasl-api.tracking.me/api/admin/invoices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Invoices response:', response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch invoices');
    }
  }
)

const CustomerBillingSlice = createSlice({
  name: 'billing',
  initialState: {
    usage: null,
    loading: false,
    error: null,
    invoices: [] as any[], // Fix type error
    invoicesLoading: false,
    invoicesError: null as string | null, // Fix type error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingUsage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBillingUsage.fulfilled, (state, action) => {
        state.loading = false
        state.usage = action.payload
      })
      .addCase(fetchBillingUsage.rejected, (state:any, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Invoices cases
      .addCase(fetchInvoices.pending, (state) => {
        state.invoicesLoading = true;
        state.invoicesError = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoicesLoading = false;
        // If API response has 'data', use it, else fallback to action.payload
        if (action.payload && Array.isArray(action.payload.data)) {
          state.invoices = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.invoices = action.payload;
        } else {
          state.invoices = [];
        }
      })
      .addCase(fetchInvoices.rejected, (state:any, action) => {
        state.invoicesLoading = false;
        state.invoicesError = action.payload;
      })
  },
})

export default CustomerBillingSlice.reducer
