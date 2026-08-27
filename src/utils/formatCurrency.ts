/**
 * Utility helper for formatting financial amounts and currencies in DevJos Studio.
 * Fully supports Dominican Pesos (DOP - RD$), US Dollars (USD - $), Euros (EUR - €), and Mexican Pesos (MXN - MX$).
 */

export const getCurrencySymbol = (currency: string = 'DOP'): string => {
  const code = (currency || 'DOP').toUpperCase().trim();
  switch (code) {
    case 'DOP':
      return 'RD$';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'MXN':
      return 'MX$';
    default:
      return code.length <= 3 ? `${code}$` : '$';
  }
};

export const formatCurrency = (
  amount: number | string | undefined | null,
  currency: string = 'DOP',
  options?: {
    compact?: boolean;
    hideDecimalsIfWhole?: boolean;
    includeCode?: boolean;
  }
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const validAmount = typeof numericAmount === 'number' && !isNaN(numericAmount) ? numericAmount : 0;
  const code = (currency || 'DOP').toUpperCase().trim();
  const symbol = getCurrencySymbol(code);

  const isWhole = Math.floor(validAmount) === validAmount;
  const minDecimals = options?.hideDecimalsIfWhole && isWhole ? 0 : 2;
  const maxDecimals = 2;

  const formattedNum = validAmount.toLocaleString('es-DO', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });

  if (code === 'DOP') {
    return `${symbol} ${formattedNum}`;
  }

  if (code === 'USD') {
    return options?.includeCode ? `$${formattedNum} USD` : `$${formattedNum}`;
  }

  if (code === 'EUR') {
    return `${formattedNum} €`;
  }

  if (code === 'MXN') {
    return options?.includeCode ? `$${formattedNum} MXN` : `$${formattedNum}`;
  }

  return `${symbol} ${formattedNum}`;
};

export const parseCurrencyInput = (value: string | number): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  // Remove currency signs, spaces, and parse clean float
  const clean = value.toString().replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};
