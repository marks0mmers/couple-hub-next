import format from "date-fns/format";
import addMinutes from "date-fns/addMinutes";

export function dateToString(date: Date | null, formatString?: string): string | null {
  if (!date) return null;
  return format(addMinutes(date, date.getTimezoneOffset()), formatString ?? "yyyy-MM-dd");
}
