import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  format,
  isSameYear,
  differenceInDays,
} from "date-fns";
import { vi } from "date-fns/locale";

export function formatDate(date: Date | string, formatString?: string) {
  const now = new Date();
  if (!(date instanceof Date)) date = new Date(date);

  if (formatString) return format(date, formatString, { locale: vi });
  else if (isSameYear(date, now)) {
    return format(date, "dd/MM, HH:mm", { locale: vi });
  } else {
    return format(date, "dd/MM/yyyy, HH:mm", { locale: vi });
  }
}
