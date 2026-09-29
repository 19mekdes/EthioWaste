import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'HIGH':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'LOW':
    default:
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'RESOLVED':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'IN_PROGRESS':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'REJECTED':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'PENDING':
    default:
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }
}
