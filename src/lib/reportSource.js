/** Report source labels for public match pages */

export const REPORT_SOURCE = {
  official_club: {
    label: 'Official Club Report',
    badge: 'Verified Club',
    className: 'bg-emerald-600 text-white',
  },
  community: {
    label: 'Community Report',
    badge: 'Community Report',
    className: 'bg-slate-600 text-white',
  },
  press: {
    label: 'Verified Press Report',
    badge: 'Verified Press',
    className: 'bg-amber-600 text-white',
  },
  club_unverified: {
    label: 'Club Report',
    badge: 'Club Account',
    className: 'bg-slate-500 text-white',
  },
};

export function resolveReportSource({ profileType, clubVerificationStatus, mediaOutletName }) {
  if (profileType === 'media') {
    return REPORT_SOURCE.press;
  }
  if (profileType === 'club' && clubVerificationStatus === 'approved') {
    return REPORT_SOURCE.official_club;
  }
  if (profileType === 'club') {
    return REPORT_SOURCE.club_unverified;
  }
  return REPORT_SOURCE.community;
}
