export function dateLabel(value) {
  return new Date(value.slice(0, 10) + 'T00:00:00').toLocaleDateString()
}
