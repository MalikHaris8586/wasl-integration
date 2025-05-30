import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import authReducer from '../../redux/auth/authSlice';
import customerReducer from './slices/customerSlice';
import apiAccessControlReducer from "./slices/apiAccessControlSlice";
import reportReducer from './slices/reportSlice';
import paymentPlanReducer from './slices/paymentPlanSlice';
import type { PaymentPlanState } from './slices/paymentPlanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    customers: customerReducer,
    apiAccessControl: apiAccessControlReducer,
    report: reportReducer,
    paymentPlan: paymentPlanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Log initial state
console.log('Initial Redux State:', store.getState());

// Subscribe to state changes
store.subscribe(() => {
  console.log('Updated Redux State:', store.getState());
});

export interface RootState {
  auth: any;
  dashboard: any;
  customers: any;
  apiAccessControl: any;
  report: any;
  paymentPlan: PaymentPlanState;
}

export type AppDispatch = typeof store.dispatch;

export default store;