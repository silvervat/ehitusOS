export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Aktiivsed projektid" value="12" change="+2 sel kuul" />
        <StatCard title="Maksmata arved" value="23 450 EUR" change="3 arvet" />
        <StatCard title="Töötajaid" value="45" change="+3 sel kuul" />
        <StatCard title="Dokumente" value="1 234" change="+56 sel nädalal" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Viimased tegevused
        </h2>
        <div className="space-y-4">
          <ActivityItem
            title="Uus projekt loodud"
            description="Tallinna objekt - Ehitusprojekt"
            time="2 tundi tagasi"
          />
          <ActivityItem
            title="Arve kinnitatud"
            description="Arve #1234 - 5 600 EUR"
            time="4 tundi tagasi"
          />
          <ActivityItem
            title="Dokument üles laetud"
            description="Leping - Alltöö OÜ"
            time="1 päev tagasi"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string
  value: string
  change: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <p className="text-sm text-slate-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{change}</p>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
      <div className="w-2 h-2 mt-2 rounded-full bg-primary" style={{ backgroundColor: '#279989' }} />
      <div className="flex-1">
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <span className="text-xs text-slate-400">{time}</span>
    </div>
  )
}
