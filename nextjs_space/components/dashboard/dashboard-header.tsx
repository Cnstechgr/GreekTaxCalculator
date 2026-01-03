'use client';

import { Calculator, LogOut, Plus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function DashboardHeader({ user }: { user: { name?: string | null; email?: string | null } }) {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              Φορολογικός Υπολογιστής
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/business/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Νέα Επιχείρηση
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="text-sm text-right">
                <div className="font-medium">{user?.name}</div>
                <div className="text-muted-foreground text-xs">{user?.email}</div>
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Αποσύνδεση"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
