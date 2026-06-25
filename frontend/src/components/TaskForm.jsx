import { useState } from 'react';
import { createTask } from '../api/tasks';
import FormField from './FormField';

const initialForm = { title: '', description: '' };

function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      await createTask(form);
      setForm(initialForm);
      onTaskCreated?.();
    } catch (error) {
      const data = error.response?.data;
      if (data && typeof data === 'object') {
        setFieldErrors(data);
      } else {
        setFormError('Failed to create task. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
      <FormField
        id="title"
        label="Title"
        type="text"
        value={form.title}
        onChange={handleChange}
        error={fieldErrors.title}
      />

      <FormField
        id="description"
        label="Description"
        as="textarea"
        rows={3}
        value={form.description}
        onChange={handleChange}
        error={fieldErrors.description}
      />

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

export default TaskForm;
