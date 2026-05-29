import { supabase } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/authUrls';

function clubFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    county: row.county,
    verificationStatus: row.verification_status,
    verificationMethod: row.verification_method,
    verificationProofUrl: row.verification_proof_url,
    verificationMessage: row.verification_message,
    verificationSubmittedAt: row.verification_submitted_at,
    verifiedAt: row.verified_at,
    rejectionReason: row.rejection_reason,
  };
}

export async function submitClubVerification({ clubId, method, proofUrl, message }) {
  const { data, error } = await supabase.rpc('submit_club_verification', {
    p_club_id: clubId,
    p_method: method,
    p_proof_url: proofUrl || null,
    p_message: message || null,
  });
  if (error) throw error;
  return clubFromRow(data);
}

export async function redeemClubInviteToken(token) {
  const { data, error } = await supabase.rpc('redeem_club_invite_token', {
    p_token: token.trim(),
  });
  if (error) throw error;
  return clubFromRow(data);
}

export async function uploadVerificationProof(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to upload proof.');

  const safeName = file.name.replace(/[^\w.-]+/g, '_');
  const path = `${user.id}/verification/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('clubreporter')
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('clubreporter').getPublicUrl(path);
  return data.publicUrl;
}

export async function listPendingClubVerifications() {
  const { data, error } = await supabase
    .from('clubs')
    .select('id, name, county, verification_status, verification_method, verification_proof_url, verification_message, verification_submitted_at, user_id')
    .eq('verification_status', 'pending')
    .order('verification_submitted_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function adminApproveClub(clubId) {
  const { data, error } = await supabase.rpc('admin_approve_club', { p_club_id: clubId });
  if (error) throw error;
  return clubFromRow(data);
}

export async function adminRejectClub(clubId, reason) {
  const { data, error } = await supabase.rpc('admin_reject_club', {
    p_club_id: clubId,
    p_reason: reason || null,
  });
  if (error) throw error;
  return clubFromRow(data);
}

export async function adminCreateClubInvite({ clubName, email, expiresDays = 14 }) {
  const { data, error } = await supabase.rpc('admin_create_club_invite', {
    p_club_name: clubName || null,
    p_email: email || null,
    p_expires_days: expiresDays,
  });
  if (error) throw error;

  const inviteUrl = `${getSiteUrl()}/club/verify?token=${data.token}`;
  return { ...data, inviteUrl };
}

export async function getPublicMatchPublisher(publicId) {
  const { data, error } = await supabase.rpc('get_public_match_publisher', {
    p_public_id: publicId,
  });
  if (error) throw error;
  return {
    profileType: data?.profileType ?? null,
    mediaOutletName: data?.mediaOutletName ?? null,
    clubName: data?.clubName ?? null,
    clubVerificationStatus: data?.clubVerificationStatus ?? null,
    clubVerifiedAt: data?.clubVerifiedAt ?? null,
  };
}

export function verificationStatusLabel(status) {
  switch (status) {
    case 'approved':
      return 'Verified';
    case 'pending':
      return 'Verification pending';
    case 'rejected':
      return 'Verification declined';
    default:
      return 'Not verified';
  }
}
