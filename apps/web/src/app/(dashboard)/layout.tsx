import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white">
        <div className="p-4 border-b border-slate-700">
          <Link href="/dashboard" className="text-xl font-bold">
            Rivest
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/projects" label="Projektid" />
            <NavItem href="/invoices" label="Arved" />
            <NavItem href="/employees" label="Töötajad" />
            <NavItem href="/documents" label="Dokumendid" />
            <li className="pt-4 mt-4 border-t border-slate-700">
              <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Admin
              </span>
            </li>
            <NavItem href="/admin/cms" label="CMS Haldus" />
            <NavItem href="/settings" label="Seaded" />
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <h1 className="text-lg font-semibold text-slate-900">
            Rivest Platform
          </h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        {label}
      </Link>
    </li>
  )
}
