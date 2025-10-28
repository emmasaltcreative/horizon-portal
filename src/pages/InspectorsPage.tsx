import { useEffect, useState } from 'react';
import { fetchInspectors } from '../services/team';
import { fetchActiveInspectionCountByInspector } from '../services/inspections';
import { TeamProfile } from '../types/database';

const InspectorsPage = () => {
  const [inspectors, setInspectors] = useState<TeamProfile[]>([]);
  const [loadCounts, setLoadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadInspectors = async () => {
      const [teamMembers, counts] = await Promise.all([
        fetchInspectors(),
        fetchActiveInspectionCountByInspector()
      ]);
      setInspectors(teamMembers);
      setLoadCounts(counts);
    };

    void loadInspectors();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="hero-font text-2xl">Inspectors</h1>
        <p className="text-sm text-slate-500">
          View active inspectors and jump into their calendar to manage appointments.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inspectors.map((inspector) => (
          <div key={inspector.id} className="card space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold text-brand-primary">{inspector.full_name}</h2>
              <p className="text-sm text-slate-500">{inspector.email}</p>
              {inspector.phone && <p className="text-sm text-slate-500">{inspector.phone}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">Active inspections</span>
              <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-brand-primary">
                {loadCounts[inspector.id] ?? 0}
              </span>
            </div>
            {inspector.calendar_id && (
              <button
                onClick={() => window.open(`https://calendar.google.com/calendar/u/0/r?cid=${inspector.calendar_id}`, '_blank')}
                className="w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
              >
                View Calendar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspectorsPage;
