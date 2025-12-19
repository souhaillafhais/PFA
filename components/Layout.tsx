'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, AlertCircle, Bell, User, Map } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'REGIONAL_ADMIN';
  const isCitizen = user?.role === 'CITIZEN';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center px-2 py-2 text-xl font-bold text-primary-600">
                🚨 Urgences TN
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Link>
                <Link
                  href="/incidents"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/incidents'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Incidents
                </Link>
                <Link
                  href="/map"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/map'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Carte
                </Link>
                <Link
                  href="/notifications"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/notifications'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Alertes
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === '/admin'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Administration
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.nomComplet}</span>
                <span className="ml-2 text-xs text-gray-500">({user?.role})</span>
              </div>
              <Link
                href="/profile"
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

