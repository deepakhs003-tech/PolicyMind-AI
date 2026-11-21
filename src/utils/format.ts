const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
const date = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
export const formatMoney = (value: number) => money.format(value);
export const formatDate = (value: string) => date.format(new Date(value));
export const formatMonth = (value: string) => month.format(new Date(value + '-01T00:00:00Z'));
export const initials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join('');
export const today = () => new Date().toISOString().slice(0, 10);
