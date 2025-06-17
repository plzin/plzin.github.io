import { parseISO, format } from 'date-fns';

interface DateProps {
  date: string;
}

export function Date({ date }: DateProps) {
  const d = parseISO(date);
  return <time className="text-base-content/50" dateTime={date}>{format(d, 'LLLL d, yyyy')}</time>;
}