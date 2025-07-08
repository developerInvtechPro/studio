import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import numeroALetras from 'numero-a-letras';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function numberToWords(num: number): string {
  if (num === null || num === undefined) return '';
  try {
    // The library's default export is the function itself, so we call it directly.
    return numeroALetras(num, {
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
