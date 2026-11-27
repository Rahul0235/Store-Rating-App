export const formatRating = (value) =>
  value === null || value === undefined ? 'No ratings yet' : Number(value).toFixed(1);
