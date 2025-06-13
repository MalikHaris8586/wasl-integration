// store/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    console.log("Fetching dashboard data with token:", token);
    try {
      const response = await axios.get(
        "https://wasl-api.tracking.me/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dashboard data fetched successfully:", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboardSlice",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        console.log("Fulfilled payload:", action.payload); // 👈 Log the data here
        state.loading = false;
        state.data = action.payload; // Save the API data
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        console.log("Thunk Rejected:", action.payload); // 👈 Add this
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;
