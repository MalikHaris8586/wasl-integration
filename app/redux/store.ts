import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import dashboardReducer from './auth/dashboardSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { useDispatch } from 'react-redux'
import apiUsageReducer from '../redux/auth/apiUsageSlice';
import companiesReducer from "../redux/auth/companiesSlice"
import driverReducer from "../redux/auth/driverSlice"
import vehicleReducer from "../redux/auth/vehicleSlice"
import billingReducer from '../redux/auth/billingSlice'
import customerReducer from '../admin/store/slices/customerSlice'

// 👉 Config for persisting only auth slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  apiUsage: apiUsageReducer,
  companies: companiesReducer,
  driver: driverReducer,
  vehicle: vehicleReducer,
  billing: billingReducer,
  customers: customerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
