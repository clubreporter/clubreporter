import { supabase } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/authUrls';
import {
  adminApproveClub,
  adminRejectClub,
  adminCreateClubInvite,
  listPendingClubVerifications,
} from '@/api/clubVerification';

async function rpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw error;
  return data;
}

export async function fetchAdminAnalytics() {
  return rpc('admin_platform_analytics');
}

export async function fetchAdminUsers() {
  return rpc('admin_list_users');
}

export async function fetchAdminClubs() {
  return rpc('admin_list_clubs');
}

export async function fetchAdminPublishedReports() {
  return rpc('admin_list_published_reports');
}

export async function adminSetUserSubscription(userId, plan, status = 'active') {
  return rpc('admin_set_user_subscription', {
    p_user_id: userId,
    p_plan: plan,
    p_status: status,
  });
}

export async function adminSuspendUser(userId, suspended) {
  return rpc('admin_suspend_user', {
    p_user_id: userId,
    p_suspended: suspended,
  });
}

export async function adminSendPlatformEmail({ to, subject, body }) {
  return rpc('admin_send_platform_email', {
    p_recipient: to,
    p_subject: subject,
    p_body: body,
  });
}

export {
  listPendingClubVerifications,
  adminApproveClub,
  adminRejectClub,
  adminCreateClubInvite,
};

export function adminReportUrl(publicId) {
  return `${getSiteUrl()}/reports/${publicId}`;
}

export const SUBSCRIPTION_PLAN_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'club', label: 'Club' },
  { value: 'county', label: 'County' },
  { value: 'presspass', label: 'Media / Press Pass' },
];

export const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'trialing', label: 'Trialing' },
  { value: 'past_due', label: 'Past due' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'incomplete', label: 'Incomplete' },
];
