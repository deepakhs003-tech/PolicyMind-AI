import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { ClaimForm } from '../features/claims/ClaimForm';
import { useApi } from '../hooks/useApi';
import { claimStatuses, type Claim } from '../types/insurance';
import { formatDate, formatMoney } from '../utils/format';

export function ClaimsPage() {
  const { data, loading, error, reload } = useApi(insuranceApi.claims);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<Claim>();
  const search = query.trim().toLowerCase();
  const claims = data?.filter(
    (claim) =>
      (!status || claim.status === status) &&
      [claim.number, claim.policyNumber, claim.customerName].some((value) =>
        value.toLowerCase().includes(search),
      ),
  );
  function closeForm() {
    setParams({}, { replace: true });
  }

  return (
    <>
      <PageHeading title="Claims" description="Submit new claims and follow their review status.">
        <button
          className="button primary"
          onClick={() => {
            setNotice('');
            setParams({ new: '1' }, { replace: true });
          }}
        >
          <Plus size={18} /> New claim
        </button>
      </PageHeading>
      {notice && (
        <p className="success-notice" role="status">
          {notice}
        </p>
      )}
      <section className="card">
        <div className="table-toolbar">
          <SearchField
            label="Search claims, policies, or customers"
            value={query}
            onChange={setQuery}
          />
          <Select
            aria-label="Filter by claim status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {claimStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        {error ? (
          <ErrorState message={error} retry={reload} />
        ) : loading ? (
          <Loading />
        ) : claims?.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Claim</th>
                  <th scope="col">Policy</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Incident date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>
                      <button
                        className="text-button record-number"
                        onClick={() => setSelected(claim)}
                      >
                        {claim.number}
                      </button>
                    </td>
                    <td>
                      <span className="record-number">{claim.policyNumber}</span>
                    </td>
                    <td>{claim.customerName}</td>
                    <td>{formatMoney(claim.amount)}</td>
                    <td>{formatDate(claim.incidentDate)}</td>
                    <td>
                      <Status value={claim.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            message={
              data?.length ? 'No claims match your filters.' : 'No claims have been submitted yet.'
            }
          />
        )}
      </section>
      {selected && (
        <Dialog title="Claim details" onClose={() => setSelected(undefined)}>
          <DetailList
            rows={[
              ['Claim number', selected.number],
              ['Policy', selected.policyNumber],
              ['Customer', selected.customerName],
              ['Status', <Status value={selected.status} />],
              ['Amount', formatMoney(selected.amount)],
              ['Incident date', formatDate(selected.incidentDate)],
              ['Description', selected.description],
            ]}
          />
        </Dialog>
      )}
      {params.get('new') === '1' && (
        <Dialog title="New claim" onClose={closeForm}>
          <ClaimForm
            onClose={closeForm}
            onSaved={() => {
              closeForm();
              setStatus('');
              setQuery('');
              setNotice('Claim submitted.');
              reload();
            }}
          />
        </Dialog>
      )}
    </>
  );
}
