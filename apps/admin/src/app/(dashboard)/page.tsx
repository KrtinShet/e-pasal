import { Store, Users, BarChart3, ShoppingBag } from 'lucide-react';

const stats = [
  {
    label: 'Total Stores',
    value: '--',
    icon: Store,
    gradient: 'from-[var(--primary-lighter)] to-[var(--primary-light)]',
    iconColor: 'text-[var(--primary-main)]',
  },
  {
    label: 'Total Users',
    value: '--',
    icon: Users,
    gradient: 'from-[var(--success-lighter)] to-[var(--success-light)]',
    iconColor: 'text-[var(--success-dark)]',
  },
  {
    label: 'Active Orders',
    value: '--',
    icon: ShoppingBag,
    gradient: 'from-[var(--warning-lighter)] to-[var(--warning-light)]',
    iconColor: 'text-[var(--warning-dark)]',
  },
  {
    label: 'Revenue',
    value: '--',
    icon: BarChart3,
    gradient: 'from-[var(--primary-lighter)] to-[var(--warning-lighter)]',
    iconColor: 'text-[var(--primary-dark)]',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="animate-rise p-8">
      <div className="accent-bar mb-8">
        <h1 className="font-display text-3xl font-bold text-[var(--grey-900)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--grey-400)]">Platform overview and metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`bzr-card noise-bg relative overflow-hidden p-6 animate-rise delay-${i + 1}`}
          >
            <div
              className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-40 blur-2xl`}
            />
            <div className="relative">
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <p className="text-xs font-semibold tracking-wide text-[var(--grey-400)] uppercase">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-[var(--grey-900)]">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bzr-card animate-rise delay-5 p-6">
          <h2 className="text-sm font-semibold tracking-wide text-[var(--grey-400)] uppercase">
            Recent Activity
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--grey-100)]">
              <BarChart3 className="h-6 w-6 text-[var(--grey-300)]" />
            </div>
            <p className="text-sm text-[var(--grey-400)]">Activity feed will appear here</p>
          </div>
        </div>

        <div className="bzr-card animate-rise delay-6 p-6">
          <h2 className="text-sm font-semibold tracking-wide text-[var(--grey-400)] uppercase">
            Platform Health
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--success-lighter)]">
              <div className="status-dot bg-[var(--success-dark)]" />
            </div>
            <p className="text-sm text-[var(--grey-400)]">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
