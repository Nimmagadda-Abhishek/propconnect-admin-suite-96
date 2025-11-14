import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminUser } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shadow-soft">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your property platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-muted rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:inline">
                  {adminUser?.username || 'Admin'}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;