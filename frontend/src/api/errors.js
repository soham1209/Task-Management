// Extracts a human-readable message from an axios/DRF error response.
// DRF error bodies vary by case: {"detail": "..."} for 404s, or
// {"<field>": ["..."]} for validation errors. Falls back when there's
// no response at all (network failure) or the shape is unrecognized.
export function getErrorMessage(error, fallback) {
  const data = error.response?.data;
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;

  const firstValue = Object.values(data).find((value) => value != null);
  if (Array.isArray(firstValue)) return firstValue[0] ?? fallback;
  if (typeof firstValue === 'string') return firstValue;

  return fallback;
}
