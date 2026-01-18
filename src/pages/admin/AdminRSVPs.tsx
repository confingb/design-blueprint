import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface RSVP {
  id: string;
  name: string;
  email: string;
  attendance_status: 'attending' | 'maybe' | 'not_attending';
  guest_count: number;
  message: string | null;
  created_at: string;
}

const AdminRSVPs = () => {
  const { id } = useParams<{ id: string }>();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSVPs = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invite_id', id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRsvps(data as RSVP[]);
      }
      setLoading(false);
    };

    fetchRSVPs();
  }, [id]);

  const statusLabels = {
    attending: { label: 'Katılacak', variant: 'default' as const },
    maybe: { label: 'Belki', variant: 'secondary' as const },
    not_attending: { label: 'Katılamayacak', variant: 'destructive' as const },
  };

  const totalGuests = rsvps
    .filter((r) => r.attendance_status === 'attending')
    .reduce((sum, r) => sum + r.guest_count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/invites">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
        </Link>
        <h1 className="text-2xl font-serif text-gray-900">RSVP Listesi</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Yanıt</p>
          <p className="text-2xl font-semibold">{rsvps.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Katılacak</p>
          <p className="text-2xl font-semibold text-green-600">
            {rsvps.filter((r) => r.attendance_status === 'attending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Belki</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {rsvps.filter((r) => r.attendance_status === 'maybe').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Misafir</p>
          <p className="text-2xl font-semibold">{totalGuests}</p>
        </div>
      </div>

      {rsvps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">Henüz RSVP yanıtı yok.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">İsim</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">E-posta</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Durum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Kişi</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Mesaj</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{rsvp.name}</td>
                  <td className="px-6 py-4 text-gray-500">{rsvp.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusLabels[rsvp.attendance_status].variant}>
                      {statusLabels[rsvp.attendance_status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{rsvp.guest_count}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {rsvp.message || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(rsvp.created_at).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRSVPs;
