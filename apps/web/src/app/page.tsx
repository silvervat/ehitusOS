import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Rivest Platform
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Modern Construction Management System - Ehitusjuhtimise platvorm
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full mt-8">
            <FeatureCard
              title="Projektid"
              description="Hallake ehitusprojekte algusest lõpuni"
              icon="folder"
            />
            <FeatureCard
              title="Arved"
              description="Arveldamine ja finantsjuhtimine"
              icon="receipt"
            />
            <FeatureCard
              title="Meeskond"
              description="Töötajate ja ressursside haldamine"
              icon="users"
            />
            <FeatureCard
              title="Dokumendid"
              description="Lepingud, aktid ja muud dokumendid"
              icon="file"
            />
            <FeatureCard
              title="Ajakava"
              description="Gantt diagrammid ja planeerimine"
              icon="calendar"
            />
            <FeatureCard
              title="Aruanded"
              description="Analüütika ja raportid"
              icon="chart"
            />
          </div>

          <div className="mt-12 flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              style={{ backgroundColor: '#279989' }}
            >
              Alusta kasutamist
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Dokumentatsioon
            </Link>
          </div>

          <footer className="mt-16 text-slate-500 text-sm">
            <p>Rivest Platform v2.0 - Multi-tenant Construction Management</p>
          </footer>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(39, 153, 137, 0.1)' }}>
        <IconPlaceholder name={icon} />
      </div>
      <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  )
}

function IconPlaceholder({ name }: { name: string }) {
  return (
    <svg
      className="w-6 h-6"
      style={{ color: '#279989' }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {name === 'folder' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      )}
      {name === 'receipt' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      )}
      {name === 'users' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      )}
      {name === 'file' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      )}
      {name === 'calendar' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      )}
      {name === 'chart' && (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )}
    </svg>
  )
}
