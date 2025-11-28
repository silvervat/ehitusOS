import { useTenant } from '@/lib/tenant-context'

export function useFeature(featureName: string): boolean {
  const { tenant } = useTenant()

  if (!tenant?.features) return false

  return tenant.features[featureName] === true
}

export function useFeatures(featureNames: string[]): Record<string, boolean> {
  const { tenant } = useTenant()

  return featureNames.reduce((acc, name) => {
    acc[name] = tenant?.features?.[name] === true
    return acc
  }, {} as Record<string, boolean>)
}
