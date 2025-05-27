import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ApiUsageDay {
  date: string;
  companies: number;
  drivers: number;
  vehicles: number;
  locations: number;
}

interface ApiUsageState {
  data: ApiUsageDay[];
  loading: boolean;
  error: string | null;
}

const initialState: ApiUsageState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchApiUsage = createAsyncThunk(
  'apiUsage/fetchApiUsage',
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://wasl-api.tracking.me/api/dashboard/api-usage',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
  console.log("API Response Data:", response.data); 
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.usage)) {
        return response.data.usage;
      } else {
        return [];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'API fetch failed');
    }
  }
);

const apiUsageSlice = createSlice({
  name: 'apiUsage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchApiUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default apiUsageSlice.reducer;
