import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Users, Loader2 } from 'lucide-react';

interface Invite {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  published: boolean;
  event_date: string;
  created_at: string;
}

const AdminInvites = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInvites(data);
      }
      setLoading(false);
    };

    fetchInvites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Davetiyeler</h1>
        <Link to="/admin/invites/new">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Davetiye
          </Button>
        </Link>
      </div>

      {invites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 mb-4">Henüz davetiye oluşturulmamış.</p>
          <Link to="/admin/invites/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              İlk Davetiyeyi Oluştur
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Çift</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tarih</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Durum</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invites.map((invite) => (
                <tr key={invite.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {invite.bride_name} & {invite.groom_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      /i/{invite.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(invite.event_date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={invite.published ? 'default' : 'secondary'}>
                      {invite.published ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/i/${invite.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/invites/${invite.id}/rsvps`}>
                        <Button variant="ghost" size="sm">
                          <Users className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/invites/${invite.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
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

export default AdminInvites;
