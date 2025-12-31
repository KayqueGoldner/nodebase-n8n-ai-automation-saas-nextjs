import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zodEnum = <T>(arr: T[]): [ T, ...T[] ] => arr as [ T, ...T[] ];
