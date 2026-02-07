type InputValue = string | number | null;

export function fNumber(inputValue: InputValue, locale = 'en-US') {
  if (!inputValue) return '';

  const number = Number(inputValue);

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
}

export function fCurrency(inputValue: InputValue, locale = 'en-US', currency = 'USD') {
  if (!inputValue) return '';

  const number = Number(inputValue);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
}

export function fPercent(inputValue: InputValue, locale = 'en-US') {
  if (!inputValue) return '';

  const number = Number(inputValue) / 100;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(number);
}

export function fShortenNumber(inputValue: InputValue, locale = 'en-US') {
  if (!inputValue) return '';

  const number = Number(inputValue);

  const fm = new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

export function fData(inputValue: InputValue) {
  if (!inputValue) return '';

  if (inputValue === 0) return '0 Bytes';

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
  const decimal = 2;
  const baseValue = 1024;
  const number = Number(inputValue);
  const index = Math.floor(Math.log(number) / Math.log(baseValue));

  return `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;
}
