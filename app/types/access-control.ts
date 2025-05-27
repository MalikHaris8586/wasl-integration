export interface AccessControl {
  id: string;
  customerName: string;
  paymentPlan: string;
  companiesLimit: number;
  driversLimit: number;
  vehiclesLimit: number;
  companiesUsed: number;
  driversUsed: number;
  vehiclesUsed: number;
  status: "active" | "warning" | "critical";
  lastUpdated: Date;
} 