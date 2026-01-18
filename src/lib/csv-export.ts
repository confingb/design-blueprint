interface RSVPData {
  name: string;
  email: string;
  attendance_status: string;
  guest_count: number;
  message: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  attending: 'Katılacak',
  maybe: 'Belki',
  not_attending: 'Katılamayacak',
};

export const exportRSVPsToCSV = (rsvps: RSVPData[], inviteName: string): void => {
  const headers = ['İsim', 'E-posta', 'Durum', 'Kişi Sayısı', 'Mesaj', 'Tarih'];
  
  const rows = rsvps.map((rsvp) => [
    rsvp.name,
    rsvp.email,
    statusLabels[rsvp.attendance_status] || rsvp.attendance_status,
    rsvp.guest_count.toString(),
    rsvp.message || '',
    new Date(rsvp.created_at).toLocaleDateString('tr-TR'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `rsvp-${inviteName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
