export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Stores', value: '--' },
          { label: 'Total Users', value: '--' },
          { label: 'Active Orders', value: '--' },
          { label: 'Revenue', value: '--' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-[rgba(26,26,26,0.04)] bg-[var(--ivory)] p-5"
          >
            <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
