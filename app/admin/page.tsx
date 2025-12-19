'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'REGIONAL_ADMIN') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            Administration
          </h1>
          <p className="mt-2 text-gray-600">Panneau d'administration du système</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fonctionnalités d'administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Gestion des incidents</h3>
              <p className="text-sm text-gray-600">
                Modifier le statut des incidents, assigner des ressources
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Alertes officielles</h3>
              <p className="text-sm text-gray-600">
                Créer et gérer les alertes publiques
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Guides de prévention</h3>
              <p className="text-sm text-gray-600">
                Publier des guides de prévention
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Statistiques</h3>
              <p className="text-sm text-gray-600">
                Consulter les statistiques du système
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Les fonctionnalités d'administration complètes seront implémentées dans les prochaines versions.
            Pour l'instant, vous pouvez gérer les incidents depuis la page des incidents et créer des alertes depuis l'API.
          </p>
        </div>
      </div>
    </Layout>
  );
}

