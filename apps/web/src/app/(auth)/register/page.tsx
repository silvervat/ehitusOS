'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Building2, Loader2, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const passwordRequirements = [
    { label: 'Vähemalt 8 tähemärki', met: formData.password.length >= 8 },
    { label: 'Sisaldab suurt tähte', met: /[A-Z]/.test(formData.password) },
    { label: 'Sisaldab numbrit', met: /[0-9]/.test(formData.password) },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Paroolid ei kattu')
      return
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError('Parool ei vasta nõuetele')
      return
    }

    if (!acceptTerms) {
      setError('Pead nõustuma kasutustingimustega')
      return
    }

    setIsLoading(true)

    // Mock registration - replace with real Supabase auth later
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock success - redirect to login
      router.push('/login?registered=true')
    } catch {
      setError('Midagi läks valesti. Proovi uuesti.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Loo konto</h1>
          <p className="text-slate-500 mt-2">Alusta tasuta prooviperioodiga</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                Eesnimi
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jaan"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                Perekonnanimi
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tamm"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-posti aadress
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jaan@ettevõte.ee"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-1">
            <label htmlFor="company" className="block text-sm font-medium text-slate-700">
              Ettevõtte nimi
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Ehitus OÜ"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Parool
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Password requirements */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => (
                  <div
                    key={req.label}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? 'text-green-600' : 'text-slate-500'
                    }`}
                  >
                    <Check className={`h-3 w-3 ${req.met ? '' : 'opacity-30'}`} />
                    {req.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Kinnita parool
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Paroolid ei kattu</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              Nõustun{' '}
              <Link href="/terms" className="font-medium hover:underline" style={{ color: '#279989' }}>
                kasutustingimuste
              </Link>{' '}
              ja{' '}
              <Link href="/privacy" className="font-medium hover:underline" style={{ color: '#279989' }}>
                privaatsuspoliitikaga
              </Link>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#279989' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loon kontot...
              </>
            ) : (
              'Loo konto'
            )}
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Juba on konto?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: '#279989' }}>
            Logi sisse
          </Link>
        </p>
      </div>
    </div>
  )
}
