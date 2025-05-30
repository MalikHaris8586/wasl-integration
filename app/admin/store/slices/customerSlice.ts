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
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(
      `https://wasl-api.tracking.me/api/admin/user?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (userId: number, { getState }) => {
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(
      `https://wasl-api.tracking.me/api/admin/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ userId, data }: { userId: number; data: any }, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    if (!token) throw new Error("No authentication token found");

    try {
      console.log('Updating customer data:', { userId, data });

      // Format the update data to match API expectations
      const updateData = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number || data.phoneNumber,
        active: typeof data.active === 'number' ? data.active : (data.isActive ? 1 : 0),
        genesis_session_key: data.genesis_session_key || data.setting?.genesis_session_key || data.setting?.genesisSessionKey,
        ip_address: data.ip_address || data.setting?.ip || data.setting?.ipAddress,
        url: data.url || data.setting?.url
      };

      console.log('Sending update data:', updateData);

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

      console.log('Update Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        requestData: error.config?.data
      });

      let errorMessage = "Failed to update customer";
      
      if (error.response?.data) {
        const responseData = error.response.data;
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.type && responseData.description) {
          errorMessage = `${responseData.type}: ${JSON.stringify(responseData.description)}`;
        }
      }

      return rejectWithValue({
        message: errorMessage,
        originalError: error.response?.data
      });
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (data: any, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    if (!token) throw new Error("No authentication token found");

    try {
      // Format data exactly as per API format
      const customerData = {
        name: data.name,
        email: data.email,
        password: "12345678",
        password_confirmation: "12345678",
        role: "user",
        phone_number: data.phoneNumber || data.phone_number,
        genesis_session_key: data.setting?.genesisSessionKey || "",
        ip_address: data.setting?.ipAddress || "",
        url: data.setting?.url || ""
      };

      console.log('Sending customer data:', JSON.stringify(customerData, null, 2));

      const response = await axios.post(
        `https://wasl-api.tracking.me/api/admin/user`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Complete API Error:', error.response || error);
      console.error('Request Data:', error.config?.data);

      let errorMessage = 'Failed to create customer';
      
      if (error.response?.data) {
        const responseData = error.response.data;
        console.log('API Response Data:', responseData);
        
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.type && responseData.description) {
          errorMessage = `${responseData.type}: ${JSON.stringify(responseData.description)}`;
        }
      }

      return rejectWithValue({
        message: errorMessage,
        originalError: error.response?.data
      });
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (userId: number, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    if (!token) throw new Error("No authentication token found");

    try {
      console.log('Deleting customer with ID:', userId);

      const response = await axios.delete(
        `https://wasl-api.tracking.me/api/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Delete Response:', response.data);
      return userId;
    } catch (error: any) {
      console.error('Delete Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      let errorMessage = "Failed to delete customer";
      
      if (error.response?.data) {
        const responseData = error.response.data;
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.type && responseData.description) {
          errorMessage = `${responseData.type}: ${JSON.stringify(responseData.description)}`;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteApiAccessControl = createAsyncThunk(
  "customers/deleteApiAccessControl",
  async (id: number, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    
    if (!token) {
      console.log('No token found in state');
      throw new Error("No authentication token found");
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      };

      console.log('Making DELETE request with config:', {
        url: `https://wasl-api.tracking.me/api/admin/api-access-controls/${id}`,
        headers: config.headers
      });

      const response = await axios.delete(
        `https://wasl-api.tracking.me/api/admin/api-access-controls/${id}`,
        config
      );
      
      if (response.status === 200 || response.status === 204) {
        return id;
      }
      
      throw new Error("Failed to delete API access control");
    } catch (error: any) {
      console.log('Delete request failed:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = "Failed to delete API access control";

        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = typeof errorData.message === 'string' 
            ? errorData.message 
            : JSON.stringify(errorData.message);
        }

        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue("No response received from server");
      } else {
        return rejectWithValue(error.message || "Failed to delete API access control");
      }
    }
  }
);

export const updateCustomerStatus = createAsyncThunk(
  "customers/updateCustomerStatus",
  async ({ userId, active }: { userId: number; active: number }, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string } };
    const token = state.auth.token;
    if (!token) throw new Error("No authentication token found");

    try {
      console.log('Updating customer status:', { userId, active });

      const response = await axios.put(
        `https://wasl-api.tracking.me/api/admin/user/${userId}`,
        { active },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Update Status Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update Status Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      let errorMessage = "Failed to update customer status";
      
      if (error.response?.data) {
        const responseData = error.response.data;
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.type && responseData.description) {
          errorMessage = `${responseData.type}: ${JSON.stringify(responseData.description)}`;
        }
      }

      return rejectWithValue(errorMessage);
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
        const updatedCustomer = action.payload.data;
        const index = state.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
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
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((customer) => customer.id !== action.payload);
        if (state.selectedCustomer?.id === action.payload) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to delete customer";
      })
      .addCase(deleteApiAccessControl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApiAccessControl.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteApiAccessControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to delete API access control";
      })
      .addCase(updateCustomerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCustomer = action.payload.data;
        const index = state.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
        if (state.selectedCustomer?.id === updatedCustomer.id) {
          state.selectedCustomer = updatedCustomer;
        }
      })
      .addCase(updateCustomerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to update customer status";
      });
  },
});

export const { setToken } = customerSlice.actions;
export default customerSlice.reducer;
