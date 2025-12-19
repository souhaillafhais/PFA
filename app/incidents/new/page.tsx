'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { incidentAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const INCIDENT_TYPES = {
  URGENCE_VITALE: {
    label: 'Urgence vitale',
    sousTypes: [
      'ACCIDENT_ROUTIER',
      'INCENDIE',
      'INONDATION',
      'SEISME',
      'AUTRE_URGENCE',
    ],
  },
  PROBLEME_CIVIL: {
    label: 'Problème civil',
    sousTypes: [
      'FEU_ROUGE_CASSE',
      'PANNEAU_SIGNALISATION',
      'NID_DE_POULE',
      'ECLAIRAGE_PUBLIC',
      'AUTRE_PROBLEME',
    ],
  },
};

export default function NewIncidentPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'URGENCE_VITALE',
    sousType: 'ACCIDENT_ROUTIER',
    latitude: 36.8065,
    longitude: 10.1815,
    adresse: '',
    description: '',
    nombreVictimes: 0,
    niveauDanger: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'nombreVictimes' || name === 'niveauDanger' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await incidentAPI.create(formData);
      toast.success('Incident signalé avec succès!');
      router.push('/incidents');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'incident');
    } finally {
      setSubmitting(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Signaler un incident</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type d'incident *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Object.entries(INCIDENT_TYPES).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sousType" className="block text-sm font-medium text-gray-700 mb-2">
              Sous-type *
            </label>
            <select
              id="sousType"
              name="sousType"
              value={formData.sousType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {INCIDENT_TYPES[formData.type as keyof typeof INCIDENT_TYPES].sousTypes.map((st) => (
                <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Décrivez l'incident en détail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Adresse de l'incident"
            />
          </div>

          {formData.type === 'URGENCE_VITALE' && (
            <>
              <div>
                <label htmlFor="nombreVictimes" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de victimes
                </label>
                <input
                  id="nombreVictimes"
                  name="nombreVictimes"
                  type="number"
                  min="0"
                  value={formData.nombreVictimes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="niveauDanger" className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de danger (1-5)
                </label>
                <input
                  id="niveauDanger"
                  name="niveauDanger"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.niveauDanger}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Envoi...' : 'Signaler l\'incident'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

