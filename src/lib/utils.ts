import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ToWords } from 'to-words';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const toWords = new ToWords({
  localeCode: 'es-ES',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: true,
    currencyOptions: {
      name: 'Lempira',
      plural: 'Lempiras',
      symbol: 'L',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
  },
});


export function numberToWords(num: number): string {
  if (num === null || num === undefined) return '';
  try {
    return toWords.convert(num).toUpperCase();
  } catch (e) {
    console.error("Error converting number to words:", e);
    return "Error en conversión";
  }
}
