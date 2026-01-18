import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Users, Copy, ExternalLink, BarChart3 } from 'lucide-react';
import { InviteListSkeleton } from '@/components/common/Skeleton';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Invite {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  published: boolean;
  event_date: string;
  created_at: string;
  view_count: number;
  rsvp_enabled: boolean;
}

const AdminInvites = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleDuplicate = async (invite: Invite) => {
    setDuplicating(invite.id);
    
    try {
      // Fetch full invite data
      const { data: fullInvite, error: fetchError } = await supabase
        .from('invites')
        .select('*')
        .eq('id', invite.id)
        .single();

      if (fetchError || !fullInvite) {
        throw new Error('Davetiye yüklenemedi');
      }

      // Create new slug
      const newSlug = `${fullInvite.slug}-kopya-${Date.now().toString(36)}`;

      // Insert duplicate
      const { data: newInvite, error: insertError } = await supabase
        .from('invites')
        .insert({
          ...fullInvite,
          id: undefined,
          slug: newSlug,
          published: false,
          view_count: 0,
          created_at: undefined,
          updated_at: undefined,
        })
        .select()
        .single();

      if (insertError || !newInvite) {
        throw new Error('Kopyalama başarısız');
      }

      toast.success('Davetiye kopyalandı!');
      navigate(`/admin/invites/${newInvite.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setDuplicating(null);
    }
  };

  const handlePreview = (slug: string, published: boolean) => {
    if (published) {
      window.open(`/i/${slug}`, '_blank');
    } else {
      // For unpublished, we'd need a preview token system
      // For now, just show a toast
      toast.info('Önizleme için önce yayınlayın veya düzenleme sayfasındaki önizlemeyi kullanın.');
    }
  };

  if (loading) {
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
        <InviteListSkeleton />
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
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Görüntüleme
                </th>
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {invite.view_count || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(invite.slug, invite.published)}
                          >
                            {invite.published ? (
                              <ExternalLink className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Önizle</TooltipContent>
                      </Tooltip>

                      {invite.rsvp_enabled && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link to={`/admin/invites/${invite.id}/rsvps`}>
                              <Button variant="ghost" size="sm">
                                <Users className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>RSVP Listesi</TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(invite)}
                            disabled={duplicating === invite.id}
                          >
                            <Copy className={`w-4 h-4 ${duplicating === invite.id ? 'animate-pulse' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Kopyala</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/admin/invites/${invite.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>Düzenle</TooltipContent>
                      </Tooltip>
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
