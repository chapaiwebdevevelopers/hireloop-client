import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Toaster } from '@/components/ui/toast';


const DashbaordLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
      <DashboardSidebar></DashboardSidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
       <Toaster />
    </SidebarProvider>
    );
};

export default DashbaordLayout;