export type BillingPlan = {
  id: string;
  name: string;
  description: string;
  companyApiPrice: number;
  driverApiPrice: number;
  vehicleApiPrice: number;
  locationApiPrice: number;
  isActive: boolean;
};
