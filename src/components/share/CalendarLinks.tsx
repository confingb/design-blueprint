import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CalendarLinksProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  description?: string;
}

export const CalendarLinks = ({
  eventTitle,
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  description = '',
}: CalendarLinksProps) => {
  // Parse date and time
  const [year, month, day] = eventDate.split('-').map(Number);
  const [hour, minute] = eventTime.split(':').map(Number);
  
  // Create start and end dates (assume 4 hour event)
  const startDate = new Date(year, month - 1, day, hour, minute);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
  
  // Format for Google Calendar
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  // Format for ICS file
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, -1);
  };

  const location = `${venueName}, ${venueAddress}`;
  const fullDescription = description || `Düğün Daveti: ${eventTitle}`;

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(fullDescription)}&location=${encodeURIComponent(location)}`;

  const generateICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Studio//TR
BEGIN:VEVENT
DTSTART:${formatICSDate(startDate)}Z
DTEND:${formatICSDate(endDate)}Z
SUMMARY:${eventTitle}
DESCRIPTION:${fullDescription}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventTitle.replace(/\s+/g, '-').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Takvime Ekle
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15c0 .825.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zM19.5 19.5h-15V7.5h15v12z"
              />
            </svg>
            Google Calendar
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateICS} className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zM8 5h8v2H8V5zm0 3h8v2H8V8zm0 3h8v2H8v-2z"
            />
          </svg>
          Apple Calendar (.ics)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
