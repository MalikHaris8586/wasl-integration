import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type Company = {
  id: number;
  company_name: string;
  waslKey: string;
  status: number;
  created_at: string;
  // Add any extra fields here as needed
};

interface CompaniesState {
  data: Company[];
  loading: boolean;
  error: string | null;
  selectedCompanyDetails: Company | null;
}

const initialState: CompaniesState = {
  data: [],
  loading: false,
  error: null,
  selectedCompanyDetails: null,
};

// Fetch all companies
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (
    {
      limit = 10,
      page = 1,
      token,
    }: { limit?: number; page?: number; token: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.get(
        "https://wasl-api.tracking.me/api/genesis/wasl/company",
        {
          params: { limit, page },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Company data:", res.data.data);
      return res.data.data as Company[];
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch companies";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register company
export const registerCompany = createAsyncThunk(
  "companies/registerCompany",
  async (
    {
      customerName,
      name,
      contactPhone,
      contactEmail,
      identityNumber,
      token,
    }: {
      customerName: string;
      name: string;
      contactPhone: string;
      contactEmail: string;
      identityNumber: string;
      token: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        "https://wasl-api.tracking.me/api/genesis/wasl/company",
        {
          customer_name: customerName,
          company_name: name,
          phone_number: contactPhone,
          email: contactEmail,
          identity_number: identityNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Registered Company Data:", res.data.data);
      return res.data.data as Company;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to register company";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch single company details
export const fetchCompanyDetails = createAsyncThunk(
  "companies/fetchCompanyDetails",
  async ({ id, token }: { id: number; token: string }, thunkAPI) => {
    try {
      const res = await axios.get(
        `https://wasl-api.tracking.me/api/genesis/wasl/company/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Company Details:", res.data.data);

      return res.data.data as Company;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch company details";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    addCompany(state, action: PayloadAction<Company>) {
      state.data.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.selectedCompanyDetails = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addCompany } = companiesSlice.actions;
export default companiesSlice.reducer;
