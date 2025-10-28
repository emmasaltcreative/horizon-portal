export type TeamRole = 'admin' | 'inspector' | 'staff';

export interface TeamProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: TeamRole;
  calendar_id?: string;
  working_hours?: string;
  default_calendar?: string;
  created_at?: string;
}

export interface ClientProfile {
  id: string;
  type: 'buyer' | 'realtor';
  full_name: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

export interface Inspection {
  id: string;
  property_address: string;
  buyer_id: string;
  realtor_id?: string;
  status: 'requested' | 'scheduled' | 'confirmed' | 'completed';
  scheduled_at?: string;
  inspector_id?: string;
  created_at?: string;
  buyer?: ClientProfile;
  realtor?: ClientProfile;
  inspector?: TeamProfile;
}
