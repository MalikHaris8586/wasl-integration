export interface ReportUser {
  user_id: number;
  user_name: string;
  company_registered_count?: number;
  Driver_registered_count?: number;
  vehicle_registered_count?: number;
}

export interface BaseReport {
  filter: string;
  from: string;
  to: string;
  total: number;
  users: ReportUser[];
}

export interface CompanyReport extends BaseReport {}
export interface DriverReport extends BaseReport {}
export interface VehicleReport extends BaseReport {}

export interface Customer {
  id: string;
  customerName: string;
  status: 'active' | 'warning' | 'critical';
  companiesLimit: number;
  driversLimit: number;
  vehiclesLimit: number;
  companiesUsed: number;
  driversUsed: number;
  vehiclesUsed: number;
  lastUpdated: string;
}

export interface DetailReport extends BaseReport {
  summary: Array<{
    label: string;
    count?: number;
    description?: string;
    percentage?: string;
  }>;
  api_calls: {
    driver: {
      used: number;
      allowed: number;
      remaining: number;
    };
    company: {
      used: number;
      allowed: number;
      remaining: number;
    };
    vehicle: {
      used: number;
      allowed: number;
      remaining: number;
    };
  };
  customers?: Customer[];
} 