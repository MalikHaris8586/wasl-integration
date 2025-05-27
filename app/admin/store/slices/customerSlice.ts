import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CustomerSetting {
  id: number;
  user_id: number;
  genesis_session_key: string;
  ip: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface CustomerRole {
  name: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface Customer {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  created_at: string;
  updated_at: string;
  active: number;
  last_login_at: string | null;
  last_active_at: string | null;
  roles: CustomerRole[];
  setting: CustomerSetting;
}

interface CustomerCount {
  label: string;
  count: number;
  description: string;
}

interface CustomerState {
  customers: Customer[];
  counts: CustomerCount[];
  loading: boolean;
  error: string | null;
  token: string | null;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

const initialState: CustomerState = {
  customers: [],
  counts: [],
  loading: false,
  error: null,
  token: null,
  pagination: {
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  },
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (page: number = 1, { getState }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const token = state.auth.token;
      console.log("Fetching customers with token:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/user?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.counts = action.payload.count;
        state.pagination = {
          total: action.payload.paging.total,
          per_page: action.payload.paging.per_page,
          current_page: action.payload.paging.current_page,
          last_page: action.payload.paging.last_page,
          from: action.payload.paging.from,
          to: action.payload.paging.to,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      });
  },
});

export const { setToken } = customerSlice.actions;
export default customerSlice.reducer;
