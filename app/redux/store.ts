import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch } from 'react-redux';

// User-related reducers
import authReducer from './auth/authSlice';
import dashboardReducer from './auth/dashboardSlice';
import apiUsageReducer from './auth/apiUsageSlice';
import companiesReducer from './auth/companiesSlice';
import driverReducer from './auth/driverSlice';
import vehicleReducer from './auth/vehicleSlice';

// Admin-related reducers
import billingReducer from '../admin/store/slices/billingSlice';
import customerReducer from '../admin/store/slices/customerSlice';
import apiAccessControlReducer from '../admin/store/slices/apiAccessControlSlice';
import admindashboardReducer from '../admin/store/slices/dashboardSlice';
import reportReducer from '../admin/store/slices/reportSlice';
import { paymentPlanSlice } from '../admin/store/slices/paymentPlanSlice';
import billingReportReducer from '../admin/store/slices/billingReportSlice';
import revenueReportReducer from '../admin/store/slices/revenueReportSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth slice
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  apiUsage: apiUsageReducer,
  companies: companiesReducer,
  driver: driverReducer,
  vehicle: vehicleReducer,
  billing: billingReducer,

  // Admin reducers
  customers: customerReducer,
  apiAccessControl: apiAccessControlReducer,
  admindashboard: admindashboardReducer,
  report: reportReducer,
  billingPlans: paymentPlanSlice.reducer,
  paymentPlan: paymentPlanSlice.reducer,
  billingReport: billingReportReducer,
  revenueReport: revenueReportReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom dispatch hook
export const useAppDispatch: () => AppDispatch = useDispatch;
