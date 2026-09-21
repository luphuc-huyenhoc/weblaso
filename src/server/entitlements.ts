import { Role, SubscriptionStatus, PlanType } from '@prisma/client';
import { AuthSessionUser } from './auth';

export type FeatureKey =
  | 'extended_bazi_100y'
  | 'unlimited_saved_charts'
  | 'advanced_interpretation'
  | 'pdf_export'
  | 'admin_panel';

export function hasEntitlement(user: AuthSessionUser | null, feature: FeatureKey): boolean {
  if (!user) return false;

  // Admins have all entitlements
  if (user.role === Role.ADMIN) return true;

  if (feature === 'admin_panel') {
    return false;
  }

  const sub = user.activeSubscription;
  const isSubActive = sub && sub.status === SubscriptionStatus.ACTIVE;

  switch (feature) {
    case 'extended_bazi_100y':
    case 'advanced_interpretation':
    case 'pdf_export':
      return Boolean(isSubActive);

    case 'unlimited_saved_charts':
      return Boolean(isSubActive);

    default:
      return false;
  }
}

export function getEffectiveEntitlements(user: AuthSessionUser | null): FeatureKey[] {
  const allFeatures: FeatureKey[] = [
    'extended_bazi_100y',
    'unlimited_saved_charts',
    'advanced_interpretation',
    'pdf_export',
    'admin_panel',
  ];
  return allFeatures.filter((f) => hasEntitlement(user, f));
}
