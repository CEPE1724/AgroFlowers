export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency }).format(value);
}

export function formatPercentage(value: number, fractionDigits = 2): string {
  return `${value.toFixed(fractionDigits)} %`;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
