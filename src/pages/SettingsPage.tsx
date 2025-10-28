import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createInspector, fetchTeamMembers } from '../services/team';
import { TeamProfile } from '../types/database';

const SettingsPage = () => {
  const [team, setTeam] = useState<TeamProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roundRobinEnabled, setRoundRobinEnabled] = useState(false);
  const [roundRobinStrategy, setRoundRobinStrategy] = useState<'least_recent' | 'lowest_load'>('least_recent');

  const [formState, setFormState] = useState({
    full_name: '',
    email: '',
    phone: '',
    calendar_id: '',
    password: ''
  });

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      const members = await fetchTeamMembers();
      setTeam(members);
      setLoading(false);
    };

    void loadTeam();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { full_name, email, password, phone, calendar_id } = formState;
    if (!full_name || !email || !password) {
      toast.error('Full name, email, and password are required.');
      return;
    }

    const toastId = toast.loading('Creating inspector account…');
    try {
      const members = await createInspector({ full_name, email, password, phone, calendar_id });
      toast.success('Inspector created successfully.', { id: toastId });
      setFormState({ full_name: '', email: '', phone: '', calendar_id: '', password: '' });
      setTeam(members);
    } catch (error) {
      console.error('Failed to create inspector', error);
      toast.error('Unable to create inspector. Check Supabase service role configuration.', { id: toastId });
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <h1 className="hero-font text-2xl">Settings</h1>
        <p className="text-sm text-slate-500">
          Manage Horizon team members and scheduling preferences.
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-brand-primary">Round-robin Assignment</h2>
          <p className="text-sm text-slate-500">
            Configure how inspections are automatically assigned to inspectors. (Coming soon)
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={roundRobinEnabled}
              onChange={(event) => setRoundRobinEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-accent"
            />
            Enable round-robin inspector assignment
          </label>
          <select
            value={roundRobinStrategy}
            onChange={(event) => setRoundRobinStrategy(event.target.value as 'least_recent' | 'lowest_load')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none md:w-64"
            disabled={!roundRobinEnabled}
          >
            <option value="least_recent">Least Recently Assigned</option>
            <option value="lowest_load">Lowest Load</option>
          </select>
        </div>
        <p className="text-xs text-slate-500">
          {/* Round Robin Hook */}
          When Netlify function integration is ready, trigger the scheduling workflow inside
          <code className="ml-1 rounded bg-slate-100 px-1 py-0.5 text-[11px]">services/team.ts#createInspector</code>.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-brand-primary">Add New Inspector</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                value={formState.full_name}
                onChange={(e) => setFormState((prev) => ({ ...prev, full_name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-accent focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-accent focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Temporary password</label>
              <input
                type="password"
                value={formState.password}
                onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-accent focus:outline-none"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Google Calendar ID</label>
                <input
                  type="text"
                  value={formState.calendar_id}
                  onChange={(e) => setFormState((prev) => ({ ...prev, calendar_id: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-accent-bright"
            >
              Create Inspector
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-brand-primary">Team Directory</h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Loading team members…</p>
            ) : (
              team.map((member) => (
                <div key={member.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{member.full_name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                      {member.role}
                    </span>
                  </div>
                  {member.phone && <p className="mt-2 text-sm text-slate-500">Phone: {member.phone}</p>}
                  {member.working_hours && (
                    <p className="mt-1 text-xs text-slate-500">Hours: {member.working_hours}</p>
                  )}
                  {member.default_calendar && (
                    <p className="mt-1 text-xs text-slate-500">Default calendar: {member.default_calendar}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
