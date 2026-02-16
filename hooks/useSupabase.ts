
import { useState, useEffect } from 'react';
import { getSupabaseClient, isSupabaseConnected } from '../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export const useSupabase = () => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    setClient(supabase);
    setConnected(isSupabaseConnected());
  }, []);

  return { client, connected };
};
