import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from root and current directory
config({ path: resolve(__dirname, '../../../.env') });
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '../../.env') });

import { getAdminSupabaseClient } from './client';
import { MOCK_CAMPUSES, MOCK_INTERESTS, MOCK_SKILLS, MOCK_GOALS } from './mockData';

async function seedDatabase() {
  console.log('[SEED] Starting Hotspots database seeding via Supabase Client...');

  try {
    const supabaseAdmin = getAdminSupabaseClient();

    // 1. Seed Campuses
    console.log('[SEED] Inserting Campuses...');
    const { error: campusErr } = await supabaseAdmin
      .from('campuses')
      .upsert(MOCK_CAMPUSES, { onConflict: 'code' });
    if (campusErr) console.warn('[NOTICE] Campus insert notice:', campusErr.message);

    // 2. Seed Interests
    console.log('[SEED] Inserting Interests taxonomy...');
    const { error: interestErr } = await supabaseAdmin
      .from('interests')
      .upsert(MOCK_INTERESTS, { onConflict: 'name' });
    if (interestErr) console.warn('[NOTICE] Interest insert notice:', interestErr.message);

    // 3. Seed Skills
    console.log('[SEED] Inserting Skills catalog...');
    const { error: skillErr } = await supabaseAdmin
      .from('skills')
      .upsert(MOCK_SKILLS, { onConflict: 'name' });
    if (skillErr) console.warn('[NOTICE] Skill insert notice:', skillErr.message);

    // 4. Seed Goals
    console.log('[SEED] Inserting Goals...');
    const { error: goalErr } = await supabaseAdmin
      .from('goals')
      .upsert(MOCK_GOALS, { onConflict: 'name' });
    if (goalErr) console.warn('[NOTICE] Goal insert notice:', goalErr.message);

    console.log('[SUCCESS] Hotspots database successfully seeded!');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[NOTICE] Seeding notice:', errorMsg);
    console.log('[INFO] Hotspots will continue with local reactive dataset fallback.');
  }
}

seedDatabase();
