import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { TeamProfile } from '../types/database';
import { mockTeam } from '../utils/mockData';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || process.env.API_BASE_URL || '/.netlify/functions';

export const fetchInspectors = async (): Promise<TeamProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('team_profiles')
      .select('*')
      .eq('role', 'inspector')
      .order('full_name');

    if (error) throw error;

    return (data as TeamProfile[]) ?? [];
  } catch (error) {
    console.warn('Falling back to mock inspectors', error);
    return mockTeam.filter((member) => member.role === 'inspector');
  }
};

export const fetchTeamMembers = async (): Promise<TeamProfile[]> => {
  try {
    const { data, error } = await supabase.from('team_profiles').select('*').order('full_name');

    if (error) throw error;

    return (data as TeamProfile[]) ?? [];
  } catch (error) {
    console.warn('Falling back to mock team members', error);
    return mockTeam;
  }
};

export interface CreateInspectorPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  calendar_id?: string;
}

export const createInspector = async (payload: CreateInspectorPayload) => {
  // Placeholder for future round-robin integration.
  // Round Robin TODO: When implementing automated scheduling, hook into the Netlify function
  // responsible for distributing inspections here.

  await axios.post(`${apiBaseUrl}/createInspector`, payload);

  // Refresh client-side cache by pulling the latest team list.
  return fetchTeamMembers();
};
