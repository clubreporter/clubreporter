import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Delete all user-owned data in parallel batches
    const deleteAll = async (entityName) => {
      const records = await base44.entities[entityName].list('-created_date', 500);
      await Promise.all(records.map(r => base44.entities[entityName].delete(r.id)));
    };

    // Order matters: delete incidents before matches, players/sponsors before clubs
    await deleteAll('MatchIncident');
    await deleteAll('Match');
    await deleteAll('Player');
    await deleteAll('Sponsor');
    await deleteAll('Team');
    await deleteAll('Venue');
    await deleteAll('Club');

    console.log(`Account data deleted for user ${user.email}`);
    return Response.json({ success: true });

  } catch (err) {
    console.error('deleteAccount error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});