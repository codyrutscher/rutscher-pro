import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface VelocityReading {
  id?: string;
  velocity: number;
  type: 'pitching' | 'pulldown' | 'infield' | 'knees';
  date: string;
  time: string;
  notes?: string;
  created_at?: string;
}
