'use client'

import { useState } from 'react'

type Project = {
  id: string
  code: string
  name: string
  client: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  budget: number
  startDate: string
  endDate: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    code: 'PRJ-001',
    name: 'Tallinna Ärikeskus',
    client: 'Nordic Properties OÜ',
    status: 'active',
    budget: 1250000,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
  },
  {
    id: '2',
    code: 'PRJ-002',
    name: 'Tartu Elamu',
    client: 'Kodumaja AS',
    status: 'active',
    budget: 450000,
    startDate: '2024-03-01',
    endDate: '2024-09-30',
  },
  {
    id: '3',
    code: 'PRJ-003',
    name: 'Pärnu Hotell',
    client: 'Hotel Group OÜ',
    status: 'draft',
    budget: 2100000,
    startDate: '2024-06-01',
    endDate: '2025-06-30',
  },
  {
    id: '4',
    code: 'PRJ-004',
    name: 'Narva Tööstushall',
    client: 'Industrial Corp AS',
    status: 'completed',
    budget: 680000,
    startDate: '2023-06-01',
    endDate: '2024-02-28',
  },
]

const statusLabels = {
  draft: { label: 'Mustand', color: 'bg-slate-100 text-slate-700' },
  active: { label: 'Aktiivne', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Lõpetatud', color: 'bg-blue-100 text-blue-700' },
  archived: { label: 'Arhiveeritud', color: 'bg-gray-100 text-gray-700' },
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Projektid</h1>
        <button
          className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: '#279989' }}
        >
          + Lisa projekt
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Otsi projekte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none">
            <option value="">Kõik staatused</option>
            <option value="draft">Mustand</option>
            <option value="active">Aktiivne</option>
            <option value="completed">Lõpetatud</option>
          </select>
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                Kood
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                Nimi
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                Klient
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                Staatus
              </th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-slate-900">
                Eelarve
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900">
                Periood
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono text-slate-600">
                  {project.code}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-900">
                    {project.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {project.client}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusLabels[project.status].color}`}
                  >
                    {statusLabels[project.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">
                  {project.budget.toLocaleString('et-EE')} EUR
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
