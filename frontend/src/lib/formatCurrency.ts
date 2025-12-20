export function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

export function formatVndCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)}M þ`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k þ`;
  }
  return formatVnd(value);
}
