export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const TASK_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500',
};

export const TASK_STATUS_ACCENTS = {
  pending: 'bg-amber-400',
  in_progress: 'bg-blue-500',
  done: 'bg-emerald-400',
};
