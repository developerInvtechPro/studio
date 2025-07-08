import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import numeroALetras from 'numero-a-letras';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function numberToWords(num: number): string {
  if (num === null || num === undefined) return '';
  try {
    // This is a robust way to handle CJS/ESM interop issues.
    // Some bundlers will place the CJS module's exports on a `default` property.
    const conversor = (numeroALetras as any).default || numeroALetras;
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
