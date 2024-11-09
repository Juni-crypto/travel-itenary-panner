const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function parseCurrency(value: string): number {
  const numericValue = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(numericValue);
}