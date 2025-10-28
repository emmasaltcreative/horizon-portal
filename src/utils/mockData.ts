import { ClientProfile, Inspection, TeamProfile } from '../types/database';

export const mockTeam: TeamProfile[] = [
  {
    id: 'mock-admin',
    full_name: 'Alex Morgan',
    email: 'alex@horizonhomeva.com',
    role: 'admin',
    phone: '555-1000',
    calendar_id: 'alex.morgan@horizonhomeva.com'
  },
  {
    id: 'mock-inspector-1',
    full_name: 'Jordan Smith',
    email: 'jordan@horizonhomeva.com',
    role: 'inspector',
    phone: '555-2000',
    calendar_id: 'jordan.smith@horizonhomeva.com'
  }
];

export const mockClients: ClientProfile[] = [
  {
    id: 'mock-buyer-1',
    type: 'buyer',
    full_name: 'Taylor Johnson',
    email: 'taylor@example.com',
    phone: '555-3000'
  },
  {
    id: 'mock-realtor-1',
    type: 'realtor',
    full_name: 'Jamie Lee',
    email: 'jamie@example.com',
    phone: '555-4000'
  }
];

export const mockInspections: Inspection[] = [
  {
    id: 'mock-inspection-1',
    property_address: '123 Elm Street, Richmond, VA',
    buyer_id: 'mock-buyer-1',
    realtor_id: 'mock-realtor-1',
    inspector_id: 'mock-inspector-1',
    status: 'scheduled',
    scheduled_at: new Date().toISOString(),
    buyer: mockClients[0],
    realtor: mockClients[1],
    inspector: mockTeam[1]
  },
  {
    id: 'mock-inspection-2',
    property_address: '456 Maple Avenue, Norfolk, VA',
    buyer_id: 'mock-buyer-1',
    status: 'requested',
    buyer: mockClients[0]
  }
];
