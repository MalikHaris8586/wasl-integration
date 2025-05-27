import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CustomerSetting {
  id?: number;
  user_id?: number;
  genesis_session_key?: string;
  ip?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
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
  setting?: CustomerSetting;
}

interface CustomerCount {
  label: string;
  count: number;
  description: string;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
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
  selectedCustomer: null,
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

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (userId: number, { getState }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const token = state.auth.token;
      console.log("Fetching customer with token:", token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `https://wasl-api.tracking.me/api/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Single Customer API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ userId, data }: { userId: number; data: any }, { getState }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const token = state.auth.token;
      console.log("Updating customer with token:", token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Ensure setting object exists
      const updateData = {
        ...data,
        setting: {
          ip: data.setting?.ip || "",
          genesis_session_key: data.setting?.genesis_session_key || "",
          url: data.setting?.url || "",
        },
      };

      const response = await axios.put(
        `https://wasl-api.tracking.me/api/admin/user/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update Customer API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (data: any, { getState }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const token = state.auth.token;
      console.log("Creating customer with token:", token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `https://wasl-api.tracking.me/api/admin/user`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
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
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload.data;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customer details";
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Update the customer in the list
        const updatedCustomer = action.payload.data;
        const index = state.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
        // Update selected customer if it's the same one
        if (state.selectedCustomer?.id === updatedCustomer.id) {
          state.selectedCustomer = updatedCustomer;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update customer";
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.customers = [...state.customers, action.payload.data];
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create customer";
      });
  },
});

export const { setToken } = customerSlice.actions;
export default customerSlice.reducer;
