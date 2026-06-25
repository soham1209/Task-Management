function FormField({ id, label, error, as = 'input', ...fieldProps }) {
  const Element = as;
  const hasError = Boolean(error);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <Element
        id={id}
        name={id}
        aria-invalid={hasError}
        className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${
          hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
        }`}
        {...fieldProps}
      />
      {hasError && (
        <p className="mt-1.5 text-sm text-red-600">{[].concat(error).join(' ')}</p>
      )}
    </div>
  );
}

export default FormField;
