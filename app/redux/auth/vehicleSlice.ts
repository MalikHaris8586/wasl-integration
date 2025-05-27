// store/slices/vehicleSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export interface Vehicle {
  id: number
  vehicle_name: string
  response: string
  status: number
  wasl_asset_key: string
  company: {
    company_name: string
    waslKey: string
  }
}

interface VehicleState {
  data: Vehicle[]
  loading: boolean
  error: string | null
}

const initialState: VehicleState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchVehicle = createAsyncThunk(
  "vehicle/fetchVehicle",
  async ({ token }: { token: string }, thunkAPI) => {
    console.log("Received token" , token)
    try {
      const res = await fetch("https://wasl-api.tracking.me/api/genesis/wasl/vehicle", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Unauthorized or fetch failed")
        const data = await res.json()
      console.log("Api Response:" ,data)
      return data.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Fetch failed")
    }
  }
)

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchVehicle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default vehicleSlice.reducer
