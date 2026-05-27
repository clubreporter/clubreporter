import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getBrandForUser, applyBrandTheme } from '@/lib/brandConfig';

export function useSportBrand() {
  const { user } = useAuth();
  const brand = getBrandForUser(user);

  useEffect(() => {
    if (user?.primarySport || user?.profileType === 'media') {
      applyBrandTheme(user.profileType === 'media' ? 'media' : user.primarySport || 'gaa');
    }
  }, [user?.primarySport, user?.profileType]);

  return brand;
}

export function SportBadge({ className = '' }) {
  const brand = useSportBrand();
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${className}`}
      style={{ backgroundColor: brand.color || '#1a6b3c' }}
    >
      {brand.motif} {brand.product}
    </span>
  );
}
