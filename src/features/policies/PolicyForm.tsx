import { useState, type FormEvent } from 'react';
import { errorMessage, insuranceApi } from '../../api/insurance';
import { ErrorState, Loading, Select } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { policyTypes, type PolicyType } from '../../types/insurance';

export function PolicyForm({ onSaved, onClose }: { onSaved: () => void; onClose: () => void }) {
  const { data: customers, loading, error, reload } = useApi(insuranceApi.customers);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const startDate = String(data.get('startDate'));
    const endDate = String(data.get('endDate'));
    if (endDate <= startDate) {
      setMessage('End date must be after the start date.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await insuranceApi.createPolicy({
        customerId: String(data.get('customerId')),
        type: data.get('type') as PolicyType,
        premium: Number(data.get('premium')),
        coverage: Number(data.get('coverage')),
        startDate,
        endDate,
      });
      onSaved();
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorState message={error} retry={reload} />;
  if (loading || !customers) return <Loading label="Loading customers…" />;
  if (!customers.length)
    return <p className="dialog-body">A customer record is required to create a policy.</p>;

  return (
    <form onSubmit={submit} className="dialog-body form-grid">
      <label>
        Customer
        <Select aria-label="Customer" name="customerId" required defaultValue="">
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
      </label>
      <label>
        Policy type
        <Select aria-label="Policy type" name="type" required>
          {policyTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
      </label>
      <label>
        Premium (USD)
        <input type="number" name="premium" min="0.01" max="100000000" step="0.01" required />
      </label>
      <label>
        Coverage (USD)
        <input type="number" name="coverage" min="0.01" max="100000000" step="0.01" required />
      </label>
      <label>
        Start date
        <input type="date" name="startDate" required />
      </label>
      <label>
        End date
        <input type="date" name="endDate" required />
      </label>
      {message && (
        <p role="alert" className="form-error wide">
          {message}
        </p>
      )}
      <div className="form-actions wide">
        <button type="button" className="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="button primary" disabled={saving}>
          {saving ? 'Creating…' : 'Create policy'}
        </button>
      </div>
    </form>
  );
}
