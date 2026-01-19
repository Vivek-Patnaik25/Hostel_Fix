import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateTicketId(hostelNo: string) {
    const date = new Date();
    const year = date.getFullYear();
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `HMRS-${year}-${sequence}-${hostelNo}`;
}
