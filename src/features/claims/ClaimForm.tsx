import { useState, type FormEvent } from 'react';
import { errorMessage, insuranceApi } from '../../api/insurance';
import { ErrorState, Loading, Select } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { today } from '../../utils/format';

export function ClaimForm({ onSaved, onClose }: { onSaved: () => void; onClose: () => void }) {
  const { data: policies, loading, error, reload } = useApi(insuranceApi.policies);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    setSaving(true);
    setMessage('');

    try {
      await insuranceApi.createClaim({
        policyId: String(data.get('policyId')),
        incidentDate: String(data.get('incidentDate')),
        amount: Number(data.get('amount')),
        description: String(data.get('description')).trim(),
      });
      onSaved();
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorState message={error} retry={reload} />;
  if (loading || !policies) return <Loading label="Loading policies…" />;
  if (!policies.length)
    return <p className="dialog-body">Create a policy before submitting a claim.</p>;

  return (
    <form onSubmit={submit} className="dialog-body form-grid">
      <label className="wide">
        Policy
        <Select aria-label="Policy" name="policyId" required defaultValue="">
          <option value="" disabled>
            Select a policy
          </option>
          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>
              {policy.number} · {policy.customerName}
            </option>
          ))}
        </Select>
      </label>
      <label>
        Incident date
        <input type="date" name="incidentDate" max={today()} required />
      </label>
      <label>
        Claim amount (USD)
        <input type="number" name="amount" min="0.01" max="100000000" step="0.01" required />
      </label>
      <label className="wide">
        Description
        <textarea name="description" rows={4} minLength={10} maxLength={1000} required />
      </label>
      {message && (
        <p className="form-error wide" role="alert">
          {message}
        </p>
      )}
      <div className="form-actions wide">
        <button type="button" className="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="button primary" disabled={saving}>
          {saving ? 'Submitting…' : 'Submit claim'}
        </button>
      </div>
    </form>
  );
}
