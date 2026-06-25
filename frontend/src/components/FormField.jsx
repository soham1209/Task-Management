function FormField({ id, label, error, as = 'input', ...fieldProps }) {
  const Element = as;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Element
        id={id}
        name={id}
        className="w-full rounded border border-gray-300 px-3 py-2"
        {...fieldProps}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{[].concat(error).join(' ')}</p>
      )}
    </div>
  );
}

export default FormField;
