import { supabase } from '@/lib/supabase';

const TABLES = {
  Club: 'clubs',
  Player: 'players',
  Team: 'teams',
  Venue: 'venues',
  Sponsor: 'sponsors',
  Match: 'matches',
  MatchIncident: 'match_incidents',
};

const CAMEL_TO_SNAKE = {
  userId: 'user_id',
  clubId: 'club_id',
  primaryColour: 'primary_colour',
  secondaryColour: 'secondary_colour',
  accentColour: 'accent_colour',
  contactEmail: 'contact_email',
  contactPhone: 'contact_phone',
  logoUrl: 'logo_url',
  websiteLink: 'website_link',
  homeTeamName: 'home_team_name',
  awayTeamName: 'away_team_name',
  matchDate: 'match_date',
  sponsorName: 'sponsor_name',
  sponsorLogo: 'sponsor_logo',
  sponsorLink: 'sponsor_link',
  homeGoals: 'home_goals',
  homePoints: 'home_points',
  awayGoals: 'away_goals',
  awayPoints: 'away_points',
  halfTimeHome: 'half_time_home',
  halfTimeAway: 'half_time_away',
  publicId: 'public_id',
  reportPublished: 'report_published',
  homeLineup: 'home_lineup',
  homeSubs: 'home_subs',
  awayLineup: 'away_lineup',
  awaySubs: 'away_subs',
  reportDraft: 'report_draft',
  playerOfMatch: 'player_of_match',
  currentMinute: 'current_minute',
  lastIncidentId: 'last_incident_id',
  matchId: 'match_id',
};

const SNAKE_TO_CAMEL = Object.fromEntries(
  Object.entries(CAMEL_TO_SNAKE).map(([k, v]) => [v, k])
);

function toSnakeKey(key) {
  if (CAMEL_TO_SNAKE[key]) return CAMEL_TO_SNAKE[key];
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function toCamelKey(key) {
  if (SNAKE_TO_CAMEL[key]) return SNAKE_TO_CAMEL[key];
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toCamel(row) {
  if (!row) return row;
  const out = { id: row.id };
  for (const [k, v] of Object.entries(row)) {
    if (k === 'id') continue;
    const camel = toCamelKey(k);
    out[camel] = v;
    if (k === 'created_at') out.created_date = v;
    if (k === 'user_id') out.created_by = v;
  }
  return out;
}

function toSnake(data) {
  const out = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    if (k === 'created_date' || k === 'created_by') continue;
    out[toSnakeKey(k)] = v;
  }
  return out;
}

function parseSort(sort) {
  if (!sort) return { column: 'created_at', ascending: false };
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  const column = field === 'created_date' ? 'created_at' : field === 'matchDate' ? 'match_date' : toSnakeKey(field);
  return { column, ascending: !desc };
}

async function requireUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');
  return user.id;
}

function createEntityApi(entityName) {
  const table = TABLES[entityName];

  return {
    async list(sort, limit) {
      const { column, ascending } = parseSort(sort);
      let q = supabase.from(table).select('*').order(column, { ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map(toCamel);
    },

    async filter(criteria, sort, limit) {
      const { column, ascending } = parseSort(sort);
      let q = supabase.from(table).select('*');
      for (const [key, value] of Object.entries(criteria)) {
        const col = key === 'id' ? 'id' : key === 'created_by' ? 'user_id' : toSnakeKey(key);
        q = q.eq(col, value);
      }
      q = q.order(column, { ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map(toCamel);
    },

    async create(payload) {
      const userId = await requireUserId();
      const row = { ...toSnake(payload), user_id: userId };
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return toCamel(data);
    },

    async update(id, payload) {
      const row = toSnake(payload);
      delete row.user_id;
      const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single();
      if (error) throw error;
      return toCamel(data);
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

export const entities = {
  Club: createEntityApi('Club'),
  Player: createEntityApi('Player'),
  Team: createEntityApi('Team'),
  Venue: createEntityApi('Venue'),
  Sponsor: createEntityApi('Sponsor'),
  Match: createEntityApi('Match'),
  MatchIncident: createEntityApi('MatchIncident'),
};

// Drop-in alias matching previous base44.entities usage
export default { entities };
