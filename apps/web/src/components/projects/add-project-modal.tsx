'use client'

import { useState } from 'react'
import { Button, Card, Input, Label } from '@rivest/ui'
import { X, Plus, Loader2 } from 'lucide-react'
import { useCreateProject, type ProjectInput } from '@/hooks/use-projects'

interface AddProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusOptions = [
  { value: 'draft', label: 'Mustand' },
  { value: 'active', label: 'Aktiivne' },
  { value: 'on_hold', label: 'Ootel' },
  { value: 'completed', label: 'Lõpetatud' },
  { value: 'cancelled', label: 'Tühistatud' },
]

export function AddProjectModal({ open, onOpenChange }: AddProjectModalProps) {
  const [formData, setFormData] = useState<ProjectInput>({
    code: '',
    name: '',
    description: '',
    status: 'draft',
    budget: undefined,
    currency: 'EUR',
    startDate: '',
    endDate: '',
    address: '',
    city: '',
    country: 'Estonia',
  })
  const [error, setError] = useState('')

  const createProject = useCreateProject()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? (value ? parseFloat(value) : undefined) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.code.trim()) {
      setError('Projekti kood on kohustuslik')
      return
    }

    if (!formData.name.trim()) {
      setError('Projekti nimi on kohustuslik')
      return
    }

    try {
      await createProject.mutateAsync(formData)
      // Reset form and close modal
      setFormData({
        code: '',
        name: '',
        description: '',
        status: 'draft',
        budget: undefined,
        currency: 'EUR',
        startDate: '',
        endDate: '',
        address: '',
        city: '',
        country: 'Estonia',
      })
      onOpenChange(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Projekti loomine ebaonnestus')
      }
    }
  }

  const handleClose = () => {
    setError('')
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#279989]/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#279989]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Lisa uus projekt</h2>
              <p className="text-sm text-slate-500">Loo uus ehitusprojekt</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Code and Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">Projekti kood *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="PRJ-001"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Projekti nimi *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Uus projekt"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Kirjeldus</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Projekti kirjeldus..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#279989]/20 focus:border-[#279989]"
              />
            </div>

            {/* Status and Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status">Staatus</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#279989]/20 focus:border-[#279989] bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget">Eelarve (EUR)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Alguskuupaev</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">Loppkuupaev</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">Linn</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Tallinn"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Aadress</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Aadress"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <Button type="button" variant="outline" onClick={handleClose}>
              Tuhista
            </Button>
            <Button
              type="submit"
              className="bg-[#279989] hover:bg-[#1e7a6d] text-white"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvestan...
                </>
              ) : (
                'Lisa projekt'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddProjectModal
