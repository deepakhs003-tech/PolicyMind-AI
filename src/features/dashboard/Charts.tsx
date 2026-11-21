import type { DashboardStats, DistributionItem } from '../../types/insurance';
import { formatMonth } from '../../utils/format';
import { Empty } from '../../components/ui';

const colors = ['#2870ed', '#65a8fd', '#1fa894', '#9c7bfa'];

export function ActivityChart({ months }: { months: DashboardStats['monthlyActivity'] }) {
  const max = Math.max(4, ...months.flatMap(({ policies, claims }) => [policies, claims]));
  const step = Math.ceil(max / 4);
  const ticks = [4, 3, 2, 1, 0].map((tick) => tick * step);
  return (
    <section className="card chart-card">
      <div className="card-heading">
        <div>
          <h2>Policy &amp; claim activity</h2>
          <p>New records over the last six months</p>
        </div>
      </div>
      <div className="chart-legend">
        <span>
          <i className="policy-color" /> Policies
        </span>
        <span>
          <i className="claim-color" /> Claims
        </span>
      </div>
      <div
        className="bar-chart"
        role="img"
        aria-label={months
          .map(
            ({ month, policies, claims }) =>
              formatMonth(month) + ': ' + policies + ' policies, ' + claims + ' claims',
          )
          .join('; ')}
      >
        <div className="bar-grid" aria-hidden="true">
          {ticks.map((tick) => (
            <div key={tick}>
              <span>{tick}</span>
              <i />
            </div>
          ))}
        </div>
        <div className="bar-columns" aria-hidden="true">
          {months.map(({ month, policies, claims }) => (
            <div className="bar-column" key={month}>
              <div className="bar-pair" title={policies + ' policies, ' + claims + ' claims'}>
                <div
                  className="bar policy-color"
                  style={{ height: (policies / (step * 4)) * 100 + '%' }}
                />
                <div
                  className="bar claim-color"
                  style={{ height: (claims / (step * 4)) * 100 + '%' }}
                />
              </div>
              <span>{formatMonth(month)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PolicyDistribution({ items }: { items: DistributionItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const stops = items.reduce<string[]>((segments, item, index) => {
    const start = items.slice(0, index).reduce((sum, previous) => sum + previous.count, 0);
    return segments.concat(
      colors[index % colors.length] +
        ' ' +
        (start / total) * 100 +
        '% ' +
        ((start + item.count) / total) * 100 +
        '%',
    );
  }, []);

  return (
    <section className="card chart-card distribution">
      <div className="card-heading">
        <div>
          <h2>Policy distribution</h2>
          <p>Breakdown by insurance type</p>
        </div>
      </div>
      {total ? (
        <div className="distribution-body">
          <div
            className="donut"
            aria-hidden="true"
            style={{ background: 'conic-gradient(' + stops.join(',') + ')' }}
          >
            <div>
              <strong>{total.toLocaleString()}</strong>
              <span>Policies</span>
            </div>
          </div>
          <ul className="distribution-legend">
            {items.map((item, index) => (
              <li key={item.label}>
                <i style={{ background: colors[index % colors.length] }} />
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Empty message="No policies to chart yet." />
      )}
    </section>
  );
}
