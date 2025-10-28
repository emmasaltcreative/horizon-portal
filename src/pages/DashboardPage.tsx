import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchInspections, confirmInspectionAppointment } from '../services/inspections';
import { Inspection } from '../types/database';
import StatusBadge from '../components/StatusBadge';

const tableHeaders = [
  { key: 'property_address', label: 'Property Address' },
  { key: 'buyer', label: 'Buyer Name' },
  { key: 'realtor', label: 'Realtor Name' },
  { key: 'status', label: 'Status' },
  { key: 'scheduled_at', label: 'Scheduled Date' },
  { key: 'inspector', label: 'Assigned Inspector' }
] as const;

type SortKey = typeof tableHeaders[number]['key'];

type SortDirection = 'asc' | 'desc';

const formatDateTime = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
};

const getComparableValue = (inspection: Inspection, key: SortKey) => {
    switch (key) {
      case 'buyer':
        return inspection.buyer?.full_name ?? '';
      case 'realtor':
        return inspection.realtor?.full_name ?? '';
      case 'inspector':
        return inspection.inspector?.full_name ?? '';
      case 'scheduled_at':
        return inspection.scheduled_at ?? '';
      case 'status':
        return inspection.status;
      case 'property_address':
      default:
        return inspection.property_address ?? '';
    }
  };

const DashboardPage = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('scheduled_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const loadInspections = async () => {
      setLoading(true);
      const data = await fetchInspections();
      setInspections(data);
      setLoading(false);
    };

    void loadInspections();
  }, []);

  const sortedInspections = useMemo(() => {
    const copy = [...inspections];
    copy.sort((a, b) => {
      const aValue = getComparableValue(a, sortKey);
      const bValue = getComparableValue(b, sortKey);

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [inspections, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleConfirm = async (inspection: Inspection) => {
    const toastId = toast.loading('Confirming inspection…');
    try {
      await confirmInspectionAppointment(inspection);
      setInspections((prev) =>
        prev.map((item) => (item.id === inspection.id ? { ...item, status: 'confirmed' } : item))
      );
      toast.success('Inspection confirmed and added to calendar.', { id: toastId });
    } catch (error) {
      console.error('Failed to confirm appointment', error);
      toast.error('Unable to confirm inspection. Please try again.', { id: toastId });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="hero-font text-2xl">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Review upcoming inspections and confirm appointments for Horizon clients.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                  onClick={() => toggleSort(header.key)}
                >
                  <span className="flex items-center gap-1">
                    {header.label}
                    {sortKey === header.key && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={tableHeaders.length + 1} className="px-4 py-8 text-center text-slate-500">
                  Loading inspections…
                </td>
              </tr>
            ) : sortedInspections.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length + 1} className="px-4 py-8 text-center text-slate-500">
                  No inspections to display.
                </td>
              </tr>
            ) : (
              sortedInspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">{inspection.property_address}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{inspection.buyer?.full_name ?? '—'}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{inspection.realtor?.full_name ?? '—'}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    <StatusBadge status={inspection.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{formatDateTime(inspection.scheduled_at)}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{inspection.inspector?.full_name ?? 'Unassigned'}</td>
                  <td className="px-4 py-4 text-right text-sm">
                    <button
                      onClick={() => handleConfirm(inspection)}
                      disabled={inspection.status === 'confirmed' || inspection.status === 'completed'}
                      className="rounded-lg border border-brand-primary px-4 py-2 font-medium text-brand-primary transition hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                    >
                      Confirm Appointment
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
