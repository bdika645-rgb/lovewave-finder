import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminActivityLog from "./pages/admin/AdminActivityLog";
import AdminBlockedUsers from "./pages/admin/AdminBlockedUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminNotifications from "./pages/admin/AdminNotifications";

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
            <Route path="/discover" element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            } />
            <Route path="/members" element={<Members />} />
            <Route path="/member/:id" element={<MemberProfile />} />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/matches" element={<AdminMatches />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/activity" element={<AdminActivityLog />} />
            <Route path="/admin/blocked" element={<AdminBlockedUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
