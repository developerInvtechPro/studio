
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { iconMap } from '@/lib/icons';
import { Home } from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/empresa', label: 'Empresa', icon: 'Building' },
  { href: '/admin/productos', label: 'Productos', icon: 'Package' },
  { href: '/admin/cai', label: 'CAI', icon: 'FileKey' },
  { href: '/admin/proveedores', label: 'Proveedores', icon: 'Truck' },
  { href: '/admin/compras', label: 'Compras', icon: 'ShoppingCart' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: 'Users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="font-bold text-lg">Admin</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton isActive={pathname === item.href}>
                      {Icon && <Icon />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button asChild variant="ghost">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al POS
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="p-4 flex-1">
        {children}
      </main>
    </SidebarProvider>
  );
}
