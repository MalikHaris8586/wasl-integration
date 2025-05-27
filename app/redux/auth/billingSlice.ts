import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchBillingUsage = createAsyncThunk(
  "billing/fetchBillingUsage",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      console.log(" Token in billing thunk:", token);

      const response = await axios.get("https://wasl-api.tracking.me/api/billing-usage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(" API response:", response.data);

      return response.data.api_calls;
    } catch (error: any) {
      console.error(" Billing API error:", error);
      return rejectWithValue(error.response?.data || "Error fetching billing usage");
    }
  }
);
const billingSlice = createSlice({
  name: "billing",
  initialState: {
    data: null as null | {
      driver: { allowed: number; used: number; remaining: number }
      company: { allowed: number; used: number; remaining: number }
      vehicle: { allowed: number; used: number; remaining: number }
    },
    loading: false,
    error: null as string | null,
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
        state.data = action.payload
      })
      .addCase(fetchBillingUsage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default billingSlice.reducer
