'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    }
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    setLoadingProfile(true);
    try {
      const data = await userAPI.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon profil</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {loadingProfile ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <p className="text-gray-900">{user?.nomComplet || profile?.nomComplet}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900">{user?.email || profile?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <p className="text-gray-900">{user?.telephone || profile?.telephone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <p className="text-gray-900">{user?.role || profile?.role}</p>
              </div>

              {user?.centreRegional && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Centre régional
                  </label>
                  <p className="text-gray-900">{user.centreRegional}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

