import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Driver {
  date: string;
  companies: number;
  drivers: number;
  vehicles: number;
  locations: number;
}

interface DriverState {
  data: Driver[];
  loading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchDriver = createAsyncThunk(
  "driver/fetchDriver",
  async (
    { token, search }: { token: any; search?: string },
    
    thunkAPI
  ) => {
    console.log("Received token:", token);
    try {
      let url = "https://wasl-api.tracking.me/api/genesis/wasl/driver"
      if (search && search.trim() !== "") {
        url += `?search=${encodeURIComponent(search)}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Unauthorized or fetch failed")
      }

      const data = await response.json()
       console.log("API Response:", data);

      if (Array.isArray(data.data)) {
        return data.data
      } else {
        return []
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "API fetch failed")
    }
  }
)

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriver.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDriver.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDriver.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default driverSlice.reducer
