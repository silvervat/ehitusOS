import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: '#279989' }}
              >
                R
              </div>
              <span className="text-xl font-bold text-slate-900">Rivest</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500">Pole veel kontot?</span>
              <Link
                href="/register"
                className="font-medium hover:underline"
                style={{ color: '#279989' }}
              >
                Registreeru
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2024 Rivest Platform. Kõik õigused kaitstud.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-900">
                Privaatsuspoliitika
              </Link>
              <Link href="/terms" className="hover:text-slate-900">
                Kasutustingimused
              </Link>
              <Link href="/contact" className="hover:text-slate-900">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
