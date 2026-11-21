export const policyTypes = ['Auto', 'Home', 'Life', 'Health'] as const;
export const policyStatuses = ['Active', 'Pending', 'Expired'] as const;
export const claimStatuses = ['Pending', 'In Review', 'Approved', 'Rejected'] as const;
export type PolicyType = (typeof policyTypes)[number];
export type PolicyStatus = (typeof policyStatuses)[number];
export type ClaimStatus = (typeof claimStatuses)[number];

export interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  joinedAt: string;
}
export interface NewPolicy {
  customerId: string;
  type: PolicyType;
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
}
export interface Policy extends NewPolicy {
  id: string;
  number: string;
  customerName: string;
  status: PolicyStatus;
  createdAt: string;
}
export interface NewClaim {
  policyId: string;
  incidentDate: string;
  amount: number;
  description: string;
}
export interface Claim extends NewClaim {
  id: string;
  number: string;
  policyNumber: string;
  customerName: string;
  status: ClaimStatus;
  createdAt: string;
}
export interface DistributionItem {
  label: string;
  count: number;
}
export interface DashboardStats {
  dataMode: 'demo' | 'mongo';
  totalPolicies: number;
  activePolicies: number;
  totalClaims: number;
  pendingClaims: number;
  policyDistribution: DistributionItem[];
  claimDistribution: DistributionItem[];
  monthlyActivity: { month: string; policies: number; claims: number }[];
  recentActivity: {
    id: string;
    kind: 'policy' | 'claim';
    title: string;
    reference: string;
    customerName: string;
    status: PolicyStatus | ClaimStatus;
    createdAt: string;
  }[];
}
