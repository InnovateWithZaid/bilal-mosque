import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MosqueDataProvider } from "@/contexts/MosqueDataContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import LocationPage from "./pages/LocationPage";
import MapPage from "./pages/MapPage";
import MosquesListPage from "./pages/MosquesListPage";
import MosqueDetailPage from "./pages/MosqueDetailPage";
import CommunityPage from "./pages/CommunityPage";
import ReportPage from "./pages/ReportPage";
import SettingsPage from "./pages/SettingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMosquesPage from "./pages/AdminMosquesPage";
import AdminMosqueFormPage from "./pages/AdminMosqueFormPage";
import MosqueAdminLoginPage from "./pages/MosqueAdminLoginPage";
import MosqueAdminDashboard from "./pages/MosqueAdminDashboard";
import NotFound from "./pages/NotFound";
import ThemeToggle from "./components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MosqueDataProvider>
          <FavoritesProvider>
            <AdminAuthProvider>
              <Toaster />
              <Sonner />
              <ThemeToggle />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/location" element={<LocationPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/mosques" element={<MosquesListPage />} />
                  <Route path="/mosque/:id" element={<MosqueDetailPage />} />
                  <Route path="/mosque/:id/community" element={<CommunityPage />} />
                  <Route path="/mosque/:id/report" element={<ReportPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin/dashboard" element={<AdminProtectedRoute requiredRole="core_admin"><AdminDashboard /></AdminProtectedRoute>} />
                  <Route path="/admin/mosques" element={<AdminProtectedRoute requiredRole="core_admin"><AdminMosquesPage /></AdminProtectedRoute>} />
                  <Route path="/admin/mosques/add" element={<AdminProtectedRoute requiredRole="core_admin"><AdminMosqueFormPage /></AdminProtectedRoute>} />
                  <Route path="/admin/mosques/edit/:id" element={<AdminProtectedRoute requiredRole="core_admin"><AdminMosqueFormPage /></AdminProtectedRoute>} />
                  <Route path="/mosque-admin/login" element={<MosqueAdminLoginPage />} />
                  <Route path="/mosque-admin/dashboard" element={<AdminProtectedRoute requiredRole="mosque_admin"><MosqueAdminDashboard /></AdminProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdminAuthProvider>
          </FavoritesProvider>
        </MosqueDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
