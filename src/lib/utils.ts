import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import conversor from 'numero-a-letras';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function numberToWords(num: number): string {
  if (num === null || num === undefined) return '';
  try {
    return conversor.aLetras(num, {
      plural: 'LEMPIRAS',
      singular: 'LEMPIRA',
      centimos: {
        plural: 'CENTAVOS',
        singular: 'CENTAVO'
      }
    });
  } catch (e) {
    console.error("Error converting number to words:", e);
    return "Error en conversión";
  }
}
