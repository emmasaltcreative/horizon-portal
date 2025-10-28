interface StatusBadgeProps {
  status: 'requested' | 'scheduled' | 'confirmed' | 'completed';
}

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  requested: 'bg-slate-200 text-slate-700',
  scheduled: 'bg-brand-accent/20 text-brand-primary',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-900 text-white'
};

const statusLabels: Record<StatusBadgeProps['status'], string> = {
  requested: 'Requested',
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  completed: 'Completed'
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
