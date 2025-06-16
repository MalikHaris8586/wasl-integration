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

interface Activity {
  id?: number;
  action?: string;
  customer?: string;
  time?: string;
  status?: string;
}

interface CustomerDashboardState {
  api_calls: ApiCalls;
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerDashboardState = {
  api_calls: {
    driver: { allowed: 0, used: 0, remaining: 0 },
    company: { allowed: 0, used: 0, remaining: 0 },
    vehicle: { allowed: 0, used: 0, remaining: 0 },
  },
  activities: [],
  loading: false,
  error: null,
};

export const fetchCustomerDashboard = createAsyncThunk(
  "customerDashboard/fetch",
  async ({ token }: { token: string }, thunkAPI) => {
    try {
      const response = await fetch(
        "https://wasl-api.tracking.me/api/customer/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
console.log("Customer Dashboard API Response:", response);  
      if (!response.ok) {
        throw new Error("Unauthorized or fetch failed");
      }

      const data = await response.json();
      console.log("Customer Dashboard API Response:", data);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const customerDashboardSlice = createSlice({
  name: "customerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.api_calls = action.payload.api_calls;
        state.activities = action.payload.activities || [];
      })
      .addCase(fetchCustomerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerDashboardSlice.reducer; 