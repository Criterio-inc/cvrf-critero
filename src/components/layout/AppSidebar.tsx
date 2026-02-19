'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calculator, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Översikt', icon: LayoutDashboard },
  { href: '/kalkyler', label: 'Nyttokalkyler', icon: Calculator },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar p-4">
      {/* Logo */}
      <div className="mb-8 pb-4 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">CVRF</span>
          <span className="text-sm text-muted-foreground">Nyttokalkyl</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="text-xs text-muted-foreground truncate px-3">
          {user?.email}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logga ut
        </Button>
      </div>
    </aside>
  );
}
