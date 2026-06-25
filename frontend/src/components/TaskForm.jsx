import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { createTask } from '../api/tasks';
import { parseApiError } from '../api/errors';
import FormField from './FormField';
import Spinner from './Spinner';

const initialForm = { title: '', description: '' };
const SUCCESS_MESSAGE_DURATION_MS = 3000;

function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), SUCCESS_MESSAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
    setSuccessMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setFieldErrors({ title: ['Title cannot be empty.'] });
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      await createTask(form);
      setForm(initialForm);
      setSuccessMessage('Task created successfully.');
      onTaskCreated?.();
    } catch (error) {
      const { fieldErrors: apiFieldErrors, message } = parseApiError(error);
      if (apiFieldErrors) {
        setFieldErrors(apiFieldErrors);
      } else {
        setFormError(message || 'Failed to create task. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      <div className="p-6 sm:p-10">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
            <Plus className="w-5 h-5" />
          </span>
          Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="title"
            label="Title"
            type="text"
            placeholder="e.g., Update documentation"
            value={form.title}
            onChange={handleChange}
            error={fieldErrors.title}
          />

          <FormField
            id="description"
            label="Description"
            as="textarea"
            placeholder="Add some details about this task..."
            rows={3}
            value={form.description}
            onChange={handleChange}
            error={fieldErrors.description}
          />

          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !form.title.trim()}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {submitting && <Spinner className="h-4 w-4 text-white" />}
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TaskForm;
