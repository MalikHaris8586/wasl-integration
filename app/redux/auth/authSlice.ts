import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("credentials", credentials);

      const response = await axios.post(
        "https://wasl-api.tracking.me/api/login",
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response", response);

      return response.data;
    } catch (err: any) {
      console.log("error", err);
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Register thunk added here
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    credentials: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("register credentials", credentials);

      const response = await axios.post(
        "https://wasl-api.tracking.me/api/register",
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.confirmPassword,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("register response", response);
      return response.data;
    } catch (err: any) {
      console.log("register error", err);
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    registerLoading: false,
    registerError: null,
  },
  reducers: {
    saveToken: (state: any, action: any) => {
      state.token = action.payload;
    },
    saveUserData: (state: any, action: any) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login reducers
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(loginUser.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register reducers
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(registerUser.rejected, (state: any, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      });
  },
});

export const { saveToken, saveUserData } = authSlice.actions;
export default authSlice.reducer;
