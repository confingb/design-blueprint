import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import DemoPage from "./pages/DemoPage";
import InvitePage from "./pages/InvitePage";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInvites from "./pages/admin/AdminInvites";
import AdminInviteNew from "./pages/admin/AdminInviteNew";
import AdminInviteEdit from "./pages/admin/AdminInviteEdit";
import AdminRSVPs from "./pages/admin/AdminRSVPs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo/:templateId" element={<DemoPage />} />
            <Route path="/i/:slug" element={<InvitePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminInvites />} />
              <Route path="invites" element={<AdminInvites />} />
              <Route path="invites/new" element={<AdminInviteNew />} />
              <Route path="invites/:id" element={<AdminInviteEdit />} />
              <Route path="invites/:id/rsvps" element={<AdminRSVPs />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
