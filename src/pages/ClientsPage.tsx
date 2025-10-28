import { useEffect, useMemo, useState } from 'react';
import { fetchClients } from '../services/clients';
import { ClientProfile } from '../types/database';

type Filter = 'all' | 'buyers' | 'realtors';

const filterOptions: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buyers', value: 'buyers' },
  { label: 'Realtors', value: 'realtors' }
];

const ClientsPage = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const loadClients = async () => {
      const data = await fetchClients();
      setClients(data);
    };

    void loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (filter === 'buyers') {
      return clients.filter((client) => client.type === 'buyer');
    }
    if (filter === 'realtors') {
      return clients.filter((client) => client.type === 'realtor');
    }
    return clients;
  }, [clients, filter]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="hero-font text-2xl">Clients</h1>
          <p className="text-sm text-slate-500">Browse buyer and realtor contacts stored in Supabase.</p>
        </div>
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === option.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm font-medium text-slate-800">{client.full_name}</td>
                <td className="px-4 py-4 text-sm capitalize text-slate-600">{client.type}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{client.email ?? '—'}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{client.phone ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
