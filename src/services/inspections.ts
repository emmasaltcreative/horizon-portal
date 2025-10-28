import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { Inspection } from '../types/database';
import { mockInspections } from '../utils/mockData';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || process.env.API_BASE_URL || '/.netlify/functions';

export const fetchInspections = async (): Promise<Inspection[]> => {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select(
        `*,
        buyer:client_profiles!buyer_id(*),
        realtor:client_profiles!realtor_id(*),
        inspector:team_profiles(*)`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as unknown as Inspection[]) ?? [];
  } catch (error) {
    console.warn('Falling back to mock inspections due to Supabase error', error);
    return mockInspections;
  }
};

export const confirmInspectionAppointment = async (inspection: Inspection) => {
  const payload = {
    inspectionId: inspection.id,
    propertyAddress: inspection.property_address,
    scheduledAt: inspection.scheduled_at,
    status: inspection.status,
    inspector: inspection.inspector,
    buyer: inspection.buyer,
    realtor: inspection.realtor
  };

  await axios.post(`${apiBaseUrl}/createCalendarEvent`, payload);

  const { error } = await supabase
    .from('inspections')
    .update({ status: 'confirmed' })
    .eq('id', inspection.id);

  if (error) {
    throw error;
  }
};

export const fetchActiveInspectionCountByInspector = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select('inspector_id, status')
      .in('status', ['requested', 'scheduled', 'confirmed']);

    if (error) throw error;

    const counts: Record<string, number> = {};
    data?.forEach((inspection) => {
      const key = inspection.inspector_id as string | null;
      if (!key) return;
      counts[key] = (counts[key] ?? 0) + 1;
    });

    return counts;
  } catch (error) {
    console.warn('Falling back to mock inspection load counts', error);
    return mockInspections.reduce<Record<string, number>>((acc, inspection) => {
      if (inspection.inspector_id && inspection.status !== 'completed') {
        acc[inspection.inspector_id] = (acc[inspection.inspector_id] ?? 0) + 1;
      }
      return acc;
    }, {});
  }
};
