/** Platform admin access — profiles.is_admin */

export const OWNER_ADMIN_EMAIL = 'briandavidcarey@gmail.com';

export function isAdmin(user) {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (isOwnerAdmin(user)) return true;
  return false;
}

export function isOwnerAdmin(user) {
  return user?.email?.toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase();
}

export const ADMIN_DENIED_MESSAGE = 'You do not have permission to access this page';
