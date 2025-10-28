import { supabase } from '../lib/supabaseClient';
import { ClientProfile } from '../types/database';
import { mockClients } from '../utils/mockData';

export const fetchClients = async (): Promise<ClientProfile[]> => {
  try {
    const { data, error } = await supabase.from('client_profiles').select('*').order('full_name');
    if (error) throw error;
    return (data as ClientProfile[]) ?? [];
  } catch (error) {
    console.warn('Falling back to mock clients', error);
    return mockClients;
  }
};
