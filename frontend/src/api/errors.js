// Single place that understands the shape of an axios/DRF error response.
// DRF error bodies vary by case: {"detail": "..."} for 404s/500s, or
// {"<field>": ["..."]} for validation errors. Network failures (no response
// at all) and unrecognized shapes fall back to null so callers supply
// their own fallback text.
export function parseApiError(error) {
  const data = error.response?.data;

  if (!data) return { fieldErrors: null, message: null };
  if (typeof data === 'string') return { fieldErrors: null, message: data };
  if (typeof data.detail === 'string') return { fieldErrors: null, message: data.detail };
  if (typeof data === 'object') return { fieldErrors: data, message: null };

  return { fieldErrors: null, message: null };
}

// Convenience wrapper for call sites that just want a single display
// string rather than per-field errors (e.g. a status update on one task).
export function getErrorMessage(error, fallback) {
  const { fieldErrors, message } = parseApiError(error);
  if (message) return message;

  if (fieldErrors) {
    const firstValue = Object.values(fieldErrors).find((value) => value != null);
    if (Array.isArray(firstValue)) return firstValue[0] ?? fallback;
    if (typeof firstValue === 'string') return firstValue;
  }

  return fallback;
}
