import {
  CalendarDays,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileText,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { insuranceApi } from '../api/insurance';
import { Empty, ErrorState, Loading, PageHeading, Status } from '../components/ui';
import { ActivityChart, PolicyDistribution } from '../features/dashboard/Charts';
import { useApi } from '../hooks/useApi';
import { formatDate } from '../utils/format';

export function DashboardPage() {
  const { data, error, loading, reload } = useApi(insuranceApi.dashboard);
  const metrics = data
    ? [
        {
          label: 'Total policies',
          value: data.totalPolicies,
          note: 'Across all policy types',
          icon: FileText,
          color: 'blue',
        },
        {
          label: 'Active policies',
          value: data.activePolicies,
          note: 'Policies currently in force',
          icon: ShieldCheck,
          color: 'green',
        },
        {
          label: 'Total claims',
          value: data.totalClaims,
          note: 'All submitted claims',
          icon: ClipboardList,
          color: 'purple',
        },
        {
          label: 'Pending claims',
          value: data.pendingClaims,
          note: 'Awaiting initial review',
          icon: Clock3,
          color: 'amber',
        },
      ]
    : [];

  return (
    <>
      <PageHeading
        title="Dash"
        description="Monitor your policies, claims, and recent activity."
      >
        {data?.dataMode === 'demo' && (
          <span className="demo-label">
            <i /> Demo data
          </span>
        )}
        <Link className="button primary" to="/claims?new=1">
          <Plus size={18} /> New claim
        </Link>
      </PageHeading>
      {error ? (
        <ErrorState message={error} retry={reload} />
      ) : loading || !data ? (
        <Loading label="Loading dashboard…" />
      ) : (
        <div className="dashboard-grid">
          <div className="metrics-grid">
            {metrics.map(({ label, value, note, color, icon: Icon }) => (
              <article key={label} className="card metric-card">
                <div className="metric-title">
                  <span className={'metric-icon tone-' + color}>
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <h2>{label}</h2>
                </div>
                <strong>{value.toLocaleString()}</strong>
                <p>{note}</p>
              </article>
            ))}
          </div>
          <div className="charts-grid">
            <ActivityChart months={data.monthlyActivity} />
            <PolicyDistribution items={data.policyDistribution} />
          </div>
          <section className="card">
            <div className="card-heading activity-heading">
              <div>
                <h2>Recent activity</h2>
                <p>Latest policy and claim submissions</p>
              </div>
              <CalendarDays size={19} className="muted" aria-hidden="true" />
            </div>
            {data.recentActivity.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Activity</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentActivity.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="activity-item">
                            <span
                              className={
                                'row-icon tone-' + (item.kind === 'policy' ? 'blue' : 'purple')
                              }
                            >
                              {item.kind === 'policy' ? (
                                <FileText size={17} />
                              ) : (
                                <FileCheck2 size={17} />
                              )}
                            </span>
                            <div>
                              <strong>{item.title}</strong>
                              <small className="record-number">{item.reference}</small>
                            </div>
                          </div>
                        </td>
                        <td>{item.customerName}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <Status value={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty message="No recent activity yet." />
            )}
          </section>
        </div>
      )}
    </>
  );
}
