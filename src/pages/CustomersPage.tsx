import { useState } from 'react';
import { insuranceApi } from '../api/insurance';
import {
  DetailList,
  Dialog,
  Empty,
  ErrorState,
  Loading,
  PageHeading,
  SearchField,
} from '../components/ui';
import { useApi } from '../hooks/useApi';
import type { Customer } from '../types/insurance';
import { formatDate, initials } from '../utils/format';

export function CustomersPage() {
  const { data, loading, error, reload } = useApi(insuranceApi.customers);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Customer>();
  const search = query.trim().toLowerCase();
  const customers = data?.filter((customer) =>
    [customer.name, customer.email, customer.location].some((value) =>
      value.toLowerCase().includes(search),
    ),
  );

  return (
    <>
      <PageHeading
        title="Customers"
        description="Find customer records and view their contact details."
      />
      <section className="card">
        <div className="table-toolbar">
          <SearchField label="Search customers" value={query} onChange={setQuery} />
        </div>
        {error ? (
          <ErrorState message={error} retry={reload} />
        ) : loading ? (
          <Loading />
        ) : customers?.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Email</th>
                  <th scope="col">Location</th>
                  <th scope="col">Customer since</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="activity-item">
                        <span className="avatar avatar-small">{initials(customer.name)}</span>
                        <button className="text-button" onClick={() => setSelected(customer)}>
                          {customer.name}
                        </button>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.location}</td>
                    <td>{formatDate(customer.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            message={
              data?.length
                ? 'No customers match your search.'
                : 'No customer records are available.'
            }
          />
        )}
      </section>
      {selected && (
        <Dialog title="Customer details" onClose={() => setSelected(undefined)}>
          <DetailList
            rows={[
              ['Name', selected.name],
              ['Email', selected.email],
              ['Location', selected.location],
              ['Customer since', formatDate(selected.joinedAt)],
            ]}
          />
        </Dialog>
      )}
    </>
  );
}
