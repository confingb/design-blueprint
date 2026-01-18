import { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Plus, List, Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-serif text-amber-900">Wedding Studio</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin/invites"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
          >
            <List className="w-5 h-5" />
            Davetiyeler
          </Link>
          <Link
            to="/admin/invites/new"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Davetiye
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Home className="w-4 h-4" />
              Siteye Git
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-500"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
