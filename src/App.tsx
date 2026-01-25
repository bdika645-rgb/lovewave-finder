import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrentProfileProvider } from "@/hooks/useCurrentProfile";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import { LandingContentProvider } from "@/contexts/LandingContentContext";

import { ThemeProvider } from "next-themes";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageErrorBoundary from "@/components/PageErrorBoundary";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import SkipToContent from "@/components/SkipToContent";
import FullPageLoader from "@/components/FullPageLoader";
import ImpersonationBanner from "@/components/ImpersonationBanner";

// Pages (lazy to improve TTI on first load)
import Index from "./pages/Index";

const Members = lazy(() => import("./pages/Members"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Discover = lazy(() => import("./pages/Discover"));
const Matches = lazy(() => import("./pages/Matches"));
const WhoLikedMe = lazy(() => import("./pages/WhoLikedMe"));
const WhoViewedMe = lazy(() => import("./pages/WhoViewedMe"));
const Support = lazy(() => import("./pages/Support"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

import BottomNavigation from "./components/BottomNavigation";

// Admin Pages (also lazy)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminMatches = lazy(() => import("./pages/admin/AdminMatches"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminRoles = lazy(() => import("./pages/admin/AdminRoles"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminActivityLog = lazy(() => import("./pages/admin/AdminActivityLog"));
const AdminBlockedUsers = lazy(() => import("./pages/admin/AdminBlockedUsers"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminTips = lazy(() => import("./pages/admin/AdminTips"));
const AdminSupport = lazy(() => import("./pages/admin/AdminSupport"));
const AdminLandingEditor = lazy(() => import("./pages/admin/AdminLandingEditor"));
const AdminCampaigns = lazy(() => import("./pages/admin/AdminCampaigns"));

const RouteLoader = ({ label }: { label?: string }) => (
  <FullPageLoader label={label ?? "טוען..."} className="min-h-screen bg-background flex items-center justify-center" />
);

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
            <ImpersonationProvider>
              <LandingContentProvider>
                <TooltipProvider>
                  <ImpersonationBanner />
                  <SkipToContent />
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                  <main id="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/members" element={
                  <Suspense fallback={<RouteLoader label="טוען פרופילים..." />}>
                    <Members />
                  </Suspense>
                } />
                <Route path="/member/:id" element={
                  <Suspense fallback={<RouteLoader label="טוען פרופיל..." />}>
                    <MemberProfile />
                  </Suspense>
                } />
                <Route path="/login" element={
                  <Suspense fallback={<RouteLoader label="טוען התחברות..." />}>
                    <Login />
                  </Suspense>
                } />
                <Route path="/register" element={
                  <Suspense fallback={<RouteLoader label="טוען הרשמה..." />}>
                    <Register />
                  </Suspense>
                } />
                <Route path="/forgot-password" element={
                  <Suspense fallback={<RouteLoader label="טוען..." />}>
                    <ForgotPassword />
                  </Suspense>
                } />
                <Route path="/reset-password" element={
                  <Suspense fallback={<RouteLoader label="טוען..." />}>
                    <ResetPassword />
                  </Suspense>
                } />
                <Route path="/support" element={
                  <Suspense fallback={<RouteLoader label="טוען תמיכה..." />}>
                    <Support />
                  </Suspense>
                } />
                <Route path="/terms" element={
                  <Suspense fallback={<RouteLoader label="טוען..." />}>
                    <Terms />
                  </Suspense>
                } />
                <Route path="/privacy" element={
                  <Suspense fallback={<RouteLoader label="טוען..." />}>
                    <Privacy />
                  </Suspense>
                } />

                {/* Protected Routes */}
                <Route path="/discover" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Discover">
                      <Suspense fallback={<RouteLoader label="טוען גילוי..." />}>
                        <Discover />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Messages">
                      <Suspense fallback={<RouteLoader label="טוען הודעות..." />}>
                        <Messages />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/matches" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Matches">
                      <Suspense fallback={<RouteLoader label="טוען התאמות..." />}>
                        <Matches />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/who-liked-me" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="WhoLikedMe">
                      <Suspense fallback={<RouteLoader label="טוען..." />}>
                        <WhoLikedMe />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/who-viewed-me" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="WhoViewedMe">
                      <Suspense fallback={<RouteLoader label="טוען..." />}>
                        <WhoViewedMe />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Profile">
                      <Suspense fallback={<RouteLoader label="טוען פרופיל..." />}>
                        <Profile />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <PageErrorBoundary pageName="Settings">
                      <Suspense fallback={<RouteLoader label="טוען הגדרות..." />}>
                        <Settings />
                      </Suspense>
                    </PageErrorBoundary>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes - Protected with Admin check */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען ניהול..." />}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען משתמשים..." />}>
                      <AdminUsers />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/matches" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען..." />}>
                      <AdminMatches />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/messages" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען..." />}>
                      <AdminMessages />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען אנליטיקה..." />}>
                      <AdminAnalytics />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/roles" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען הרשאות..." />}>
                      <AdminRoles />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען הגדרות..." />}>
                      <AdminSettings />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען דיווחים..." />}>
                      <AdminReports />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/activity" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען פעילות..." />}>
                      <AdminActivityLog />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/blocked" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען..." />}>
                      <AdminBlockedUsers />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/content" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען תוכן..." />}>
                      <AdminContent />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/media" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען מדיה..." />}>
                      <AdminMedia />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/notifications" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען התראות..." />}>
                      <AdminNotifications />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/tips" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען טיפים..." />}>
                      <AdminTips />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/support" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען פניות..." />}>
                      <AdminSupport />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/landing-editor" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען עורך..." />}>
                      <AdminLandingEditor />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/campaigns" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<RouteLoader label="טוען קמפיינים..." />}>
                      <AdminCampaigns />
                    </Suspense>
                  </AdminProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={
                  <Suspense fallback={<RouteLoader label="טוען..." />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
              <BottomNavigation />
              </main>
            </BrowserRouter>
          </TooltipProvider>
          </LandingContentProvider>
        </ImpersonationProvider>
      </CurrentProfileProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
</ErrorBoundary>
);

export default App;
