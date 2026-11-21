import { useState } from 'react';
import { Plus } from 'lucide-react';
import { insuranceApi } from '../api/insurance';
import {
  DetailList,
  Dialog,
  Empty,
  ErrorState,
  Loading,
  PageHeading,
  SearchField,
  Select,
  Status,
} from '../components/ui';
import { PolicyForm } from '../features/policies/PolicyForm';
import { useApi } from '../hooks/useApi';
import { policyStatuses, policyTypes, type Policy } from '../types/insurance';
import { formatDate, formatMoney } from '../utils/format';

export function PoliciesPage() {
  const { data, loading, error, reload } = useApi(insuranceApi.policies);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Policy>();
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState('');
  const search = query.trim().toLowerCase();
  const policies = data?.filter(
    (policy) =>
      (!type || policy.type === type) &&
      (!status || policy.status === status) &&
      (policy.number.toLowerCase().includes(search) ||
        policy.customerName.toLowerCase().includes(search)),
  );

  return (
    <>
      <PageHeading title="Policies" description="Search, review, and manage insurance policies.">
        <button
          className="button primary"
          onClick={() => {
            setNotice('');
            setCreating(true);
          }}
        >
          <Plus size={18} /> New policy
        </button>
      </PageHeading>
      {notice && (
        <p className="success-notice" role="status">
          {notice}
        </p>
      )}
      <section className="card">
        <div className="table-toolbar">
          <SearchField label="Search policies or customers" value={query} onChange={setQuery} />
          <div className="filters">
            <Select
              aria-label="Filter by policy type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">All types</option>
              {policyTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Select
              aria-label="Filter by policy status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {policyStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
        </div>
        {error ? (
          <ErrorState message={error} retry={reload} />
        ) : loading ? (
          <Loading />
        ) : policies?.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Policy</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Type</th>
                  <th scope="col">Premium</th>
                  <th scope="col">End date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <button
                        className="text-button record-number"
                        onClick={() => setSelected(policy)}
                      >
                        {policy.number}
                      </button>
                    </td>
                    <td>{policy.customerName}</td>
                    <td>{policy.type}</td>
                    <td>{formatMoney(policy.premium)}</td>
                    <td>{formatDate(policy.endDate)}</td>
                    <td>
                      <Status value={policy.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            message={
              data?.length
                ? 'No policies match your filters.'
                : 'No policies have been created yet.'
            }
          />
        )}
      </section>
      {selected && (
        <Dialog title="Policy details" onClose={() => setSelected(undefined)}>
          <DetailList
            rows={[
              ['Policy number', selected.number],
              ['Customer', selected.customerName],
              ['Type', selected.type],
              ['Status', <Status value={selected.status} />],
              ['Coverage', formatMoney(selected.coverage)],
              ['Premium', formatMoney(selected.premium)],
              ['Start date', formatDate(selected.startDate)],
              ['End date', formatDate(selected.endDate)],
            ]}
          />
        </Dialog>
      )}
      {creating && (
        <Dialog title="New policy" onClose={() => setCreating(false)}>
          <PolicyForm
            onClose={() => setCreating(false)}
            onSaved={() => {
              setCreating(false);
              setQuery('');
              setType('');
              setStatus('');
              setNotice('Policy created.');
              reload();
            }}
          />
        </Dialog>
      )}
    </>
  );
}
