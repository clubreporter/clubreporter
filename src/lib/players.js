/** True when a player's squad/team label matches the selected category or grade. */
export function playerMatchesCategory(player, category) {
  if (!category?.trim()) return false;
  const team = (player.team || '').trim();
  const cat = category.trim();
  if (team === cat) return true;
  // e.g. category "Senior" matches team "Senior Football"
  if (team.startsWith(`${cat} `)) return true;
  return false;
}

/** One row per player id, or per name+team when ids are missing. */
export function dedupePlayers(players) {
  const seenIds = new Set();
  const seenNameTeam = new Set();
  const result = [];

  for (const p of players) {
    if (p.id) {
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);
    }
    const nameKey = `${(p.team || '').toLowerCase()}|${(p.name || '').trim().toLowerCase()}`;
    if (seenNameTeam.has(nameKey)) continue;
    seenNameTeam.add(nameKey);
    result.push(p);
  }

  return result;
}
