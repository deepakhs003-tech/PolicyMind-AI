import axios from 'axios';
import type {
  Claim,
  Customer,
  DashboardStats,
  NewClaim,
  NewPolicy,
  Policy,
} from '../types/insurance';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
});

export const insuranceApi = {
  dashboard: (signal: AbortSignal) =>
    client.get<DashboardStats>('/dashboard/stats', { signal }).then(({ data }) => data),
  policies: (signal: AbortSignal) =>
    client.get<Policy[]>('/policies', { signal }).then(({ data }) => data),
  claims: (signal: AbortSignal) =>
    client.get<Claim[]>('/claims', { signal }).then(({ data }) => data),
  customers: (signal: AbortSignal) =>
    client.get<Customer[]>('/customers', { signal }).then(({ data }) => data),
  createPolicy: (input: NewPolicy) =>
    client.post<Policy>('/policies', input).then(({ data }) => data),
  createClaim: (input: NewClaim) => client.post<Claim>('/claims', input).then(({ data }) => data),
};

export function errorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ||
      (error.response
        ? 'The request could not be completed.'
        : 'Unable to reach the API. Check that the backend is running.')
    );
  }
  return 'Something went wrong. Try again.';
}
