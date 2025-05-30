import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface AccessControl {
  id: number;
  user_id: number;
  plan_id: number;
  ip_address: string;
  api_name: string;
  allowed_calls: number;
  used_calls: number;
  created_at: string;
  updated_at: string;
}

interface User {
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
  access_control: AccessControl[];
}

interface ApiResponse {
  paging: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    count: number;
  };
  data: User[];
}

export const fetchApiAccessControls = createAsyncThunk(
  "apiAccessControl/fetchApiAccessControls",
  async (_, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      console.log('Using token:', token);

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get<ApiResponse>(
        "https://wasl-api.tracking.me/api/admin/api-access-controls?access_control_name=company",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "apiAccessControl/fetchUserDetails",
  async (userId: number, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      console.log("token", token)
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get<{ data: User }>(
        `https://wasl-api.tracking.me/api/admin/api-access-controls/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('User Details Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }
);

export const createApiAccessControl = createAsyncThunk(
  "apiAccessControl/createApiAccessControl",
  async (data: { name: string; email: string; phone_number: string; plan_id: string }, { getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // First, create the user
      const userResponse = await axios.post(
        "https://wasl-api.tracking.me/api/admin/users",
        {
          name: data.name,
          email: data.email,
          phone_number: data.phone_number
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('User creation response:', userResponse.data);

      // Then create the access control with the user_id
      const formattedData = {
        user_id: userResponse.data.id,
        plan_id: parseInt(data.plan_id),
        api_name: "company", // Default to company API
        allowed_calls: 1000 // Default value, adjust as needed
      };

      const response = await axios.post(
        "https://wasl-api.tracking.me/api/admin/api-access-controls",
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Create API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }
);

export const updateApiAccessControl = createAsyncThunk(
  "apiAccessControl/updateApiAccessControl",
  async (data: { user_id: number; plan_id: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Remove user_id from payload since it's in the URL
      const requestPayload = {
        plan_id: data.plan_id,
        api_name: "company"
      };

      console.log('Sending request with payload:', requestPayload);

      const response = await axios.put(
        `https://wasl-api.tracking.me/api/admin/api-access-controls/${data.user_id}`,
        requestPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Full error response:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const apiAccessControlSlice = createSlice({
  name: "apiAccessControl",
  initialState: {
    users: [] as User[],
    selectedUser: null as User | null,
    paging: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0,
      count: 0,
    },
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiAccessControls.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Fetching API access controls...');
      })
      .addCase(fetchApiAccessControls.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.paging = action.payload.paging;
        console.log('Successfully fetched API access controls:', state.users);
      })
      .addCase(fetchApiAccessControls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
        console.error('Error fetching API access controls:', {
          error: action.error,
          message: action.error.message,
        });
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch user details";
      })
      .addCase(createApiAccessControl.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Creating API access control...');
      })
      .addCase(createApiAccessControl.fulfilled, (state) => {
        state.loading = false;
        console.log('Successfully created API access control');
      })
      .addCase(createApiAccessControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to create access control";
        console.error('Error creating API access control:', {
          error: action.error,
          message: action.error.message,
        });
      })
      .addCase(updateApiAccessControl.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Updating API access control...');
      })
      .addCase(updateApiAccessControl.fulfilled, (state) => {
        state.loading = false;
        console.log('Successfully updated API access control');
      })
      .addCase(updateApiAccessControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update access control";
        console.error('Error updating API access control:', {
          error: action.error,
          message: action.error.message,
        });
      });
  },
});

export default apiAccessControlSlice.reducer;
