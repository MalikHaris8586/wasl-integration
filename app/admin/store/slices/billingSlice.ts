import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBillingPlans = createAsyncThunk<any, void>(
  'billingPlans/fetchBillingPlans',
  async (_, thunkAPI) => {
    try {
      const resp = await axios.get(
        'https://wasl-api.tracking.me/api/admin/payment_plan'
      );
      console.log("Billing Plans API Response:", resp.data);
      return resp.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const billingPlanSlice = createSlice({
  name: 'billingPlans',
  initialState: {
    data: [] as any[],
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingPlans.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchBillingPlans.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.data = a.payload;
      })
      .addCase(fetchBillingPlans.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload as string;
      });
  },
});

export default billingPlanSlice.reducer;
