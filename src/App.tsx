import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrentProfileProvider } from "@/hooks/useCurrentProfile";
import { LandingContentProvider } from "@/contexts/LandingContentContext";
import { VisualEditorProvider } from "@/components/VisualEditor";
import { ThemeProvider } from "next-themes";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageErrorBoundary from "@/components/PageErrorBoundary";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import SkipToContent from "@/components/SkipToContent";

// Pages
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import WhoLikedMe from "./pages/WhoLikedMe";
import WhoViewedMe from "./pages/WhoViewedMe";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BottomNavigation from "./components/BottomNavigation";

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
import AdminTips from "./pages/admin/AdminTips";
import AdminSupport from "./pages/admin/AdminSupport";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <CurrentProfileProvider>
            <LandingContentProvider>
            <VisualEditorProvider>
            <TooltipProvider>
              <SkipToContent />
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <main id="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/members" element={<Members />} />
                <Route path="/member/:id" element={<MemberProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/support" element={<Support />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Protected Routes */}
                <Route path="/discover" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Discover">
                      <Discover />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Messages">
                      <Messages />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/matches" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Matches">
                      <Matches />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/who-liked-me" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="WhoLikedMe">
                      <WhoLikedMe />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/who-viewed-me" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="WhoViewedMe">
                      <WhoViewedMe />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Profile">
                      <Profile />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Settings">
                      <Settings />
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes - Protected with Admin check */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/matches" element={
                  <AdminProtectedRoute>
                    <AdminMatches />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/messages" element={
                  <AdminProtectedRoute>
                    <AdminMessages />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <AdminProtectedRoute>
                    <AdminAnalytics />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/roles" element={
                  <AdminProtectedRoute>
                    <AdminRoles />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <AdminProtectedRoute>
                    <AdminSettings />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <AdminProtectedRoute>
                    <AdminReports />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/activity" element={
                  <AdminProtectedRoute>
                    <AdminActivityLog />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/blocked" element={
                  <AdminProtectedRoute>
                    <AdminBlockedUsers />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/content" element={
                  <AdminProtectedRoute>
                    <AdminContent />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/notifications" element={
                  <AdminProtectedRoute>
                    <AdminNotifications />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/tips" element={
                  <AdminProtectedRoute>
                    <AdminTips />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/support" element={
                  <AdminProtectedRoute>
                    <AdminSupport />
                  </AdminProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavigation />
              </main>
            </BrowserRouter>
          </TooltipProvider>
          </VisualEditorProvider>
          </LandingContentProvider>
        </CurrentProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
</ErrorBoundary>
);

export default App;
