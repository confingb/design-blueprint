import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Search, Filter } from 'lucide-react';
import { RSVPStatsSkeleton } from '@/components/common/Skeleton';
import { exportRSVPsToCSV } from '@/lib/csv-export';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RSVP {
  id: string;
  name: string;
  email: string;
  attendance_status: 'attending' | 'maybe' | 'not_attending';
  guest_count: number;
  message: string | null;
  created_at: string;
}

interface InviteInfo {
  bride_name: string;
  groom_name: string;
  event_date: string;
  rsvp_deadline: string | null;
}

type FilterStatus = 'all' | 'attending' | 'maybe' | 'not_attending';

const AdminRSVPs = () => {
  const { id } = useParams<{ id: string }>();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Fetch RSVPs and invite info in parallel
      const [rsvpResult, inviteResult] = await Promise.all([
        supabase
          .from('rsvps')
          .select('*')
          .eq('invite_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('invites')
          .select('bride_name, groom_name, event_date, rsvp_deadline')
          .eq('id', id)
          .single(),
      ]);

      if (!rsvpResult.error && rsvpResult.data) {
        setRsvps(rsvpResult.data as RSVP[]);
      }

      if (!inviteResult.error && inviteResult.data) {
        setInviteInfo(inviteResult.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const statusLabels = {
    attending: { label: 'Katılacak', variant: 'default' as const },
    maybe: { label: 'Belki', variant: 'secondary' as const },
    not_attending: { label: 'Katılamayacak', variant: 'destructive' as const },
  };

  // Filter and search
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((rsvp) => {
      const matchesSearch =
        searchTerm === '' ||
        rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || rsvp.attendance_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rsvps, searchTerm, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const attending = rsvps.filter((r) => r.attendance_status === 'attending');
    const maybe = rsvps.filter((r) => r.attendance_status === 'maybe');
    const notAttending = rsvps.filter((r) => r.attendance_status === 'not_attending');
    const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0);

    return {
      total: rsvps.length,
      attending: attending.length,
      maybe: maybe.length,
      notAttending: notAttending.length,
      totalGuests,
    };
  }, [rsvps]);

  const handleExportCSV = () => {
    const inviteName = inviteInfo
      ? `${inviteInfo.bride_name}-${inviteInfo.groom_name}`
      : 'davetiye';
    exportRSVPsToCSV(filteredRsvps, inviteName);
  };

  if (loading) {
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
        <RSVPStatsSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/invites">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-gray-900">RSVP Listesi</h1>
            {inviteInfo && (
              <p className="text-sm text-gray-500">
                {inviteInfo.bride_name} & {inviteInfo.groom_name} - {new Date(inviteInfo.event_date).toLocaleDateString('tr-TR')}
              </p>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={filteredRsvps.length === 0}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          CSV İndir
        </Button>
      </div>

      {/* RSVP Deadline warning */}
      {inviteInfo?.rsvp_deadline && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>RSVP Son Tarihi:</strong>{' '}
            {new Date(inviteInfo.rsvp_deadline).toLocaleDateString('tr-TR')}
            {new Date(inviteInfo.rsvp_deadline) < new Date() && (
              <Badge variant="destructive" className="ml-2">Süresi Doldu</Badge>
            )}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Yanıt</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Katılacak</p>
          <p className="text-2xl font-semibold text-green-600">{stats.attending}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Belki</p>
          <p className="text-2xl font-semibold text-yellow-600">{stats.maybe}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Katılamayacak</p>
          <p className="text-2xl font-semibold text-red-600">{stats.notAttending}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Toplam Misafir</p>
          <p className="text-2xl font-semibold">{stats.totalGuests}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="İsim veya e-posta ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="attending">Katılacak</SelectItem>
              <SelectItem value="maybe">Belki</SelectItem>
              <SelectItem value="not_attending">Katılamayacak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {rsvps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">Henüz RSVP yanıtı yok.</p>
        </div>
      ) : filteredRsvps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">Arama kriterlerine uygun sonuç bulunamadı.</p>
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
              {filteredRsvps.map((rsvp) => (
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
