import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Properties from "./pages/Properties";
import SoldProperties from "./pages/SoldProperties";
import Users from "./pages/Users";
import Inquiries from "./pages/Inquiries";
import InquiryDetail from "./pages/InquiryDetail";
import AgentDetail from "./pages/AgentDetail";
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/agents" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Agents />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/properties" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Properties />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/inquiries" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Inquiries />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/sold-properties" element={
              <ProtectedRoute>
                <AdminLayout>
                  <SoldProperties />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/inquiries/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <InquiryDetail />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/agents/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AgentDetail />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
