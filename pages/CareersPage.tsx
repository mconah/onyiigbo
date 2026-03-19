import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { databases, dbId } from '../lib/appwrite';
import { Query } from 'appwrite';

interface Career {
  $id: string;
  title: string;
  title_igbo: string;
  department: string;
  department_igbo: string;
  description: string;
  description_igbo: string;
  requirements: string[];
  requirements_igbo: string[];
  responsibilities: string[];
  responsibilities_igbo: string[];
  employment_type: string;
  location: string;
  salary_range: string;
  is_active: boolean;
  posted_at: string;
  closes_at: string;
}

interface CareersPageProps {
  onNavigate: (route: { page: string }) => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const response = await databases.listDocuments(
        dbId,
        'careers',
        [
          Query.equal('is_active', true),
          Query.orderDesc('posted_at'),
        ]
      );

      setCareers(response.documents as Career[]);
    } catch (error) {
      console.error('Error loading careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time': return t('careers.fullTime');
      case 'part_time': return t('careers.partTime');
      case 'contract': return i18n.language === 'ig' ? 'Kọntrakt' : 'Contract';
      default: return type;
    }
  };

  const filteredCareers = filter === 'all'
    ? careers
    : careers.filter(c => c.employment_type === filter);

  const departments = ['all', ...Array.from(new Set(careers.map(c => c.employment_type)))];

  return (
    <div className="min-h-screen bg-light-lavender">
      {/* Hero Section */}
      <div className="bg-olive-green text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-unica-one mb-4">
            {t('careers.title')}
          </h1>
          <p className="text-xl opacity-90">
            {t('careers.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === dept
                  ? 'bg-olive-green text-white'
                  : 'bg-white text-secondary-text hover:bg-soft-gray'
              }`}
            >
              {dept === 'all' ? t('common.all') : getEmploymentTypeLabel(dept)}
            </button>
          ))}
        </div>

        {/* Careers List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green"></div>
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-primary-text mb-2">
              {t('careers.noPositions')}
            </h3>
            <p className="text-secondary-text">
              {i18n.language === 'ig'
                ? 'Biko bia azụ ma emechara. Anyị na-achọ ndị mmadụ nke ọma!'
                : 'Please check back later. We are always looking for great people!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCareers.map((career) => (
              <div
                key={career.$id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-primary-text">
                        {i18n.language === 'ig' && career.title_igbo
                          ? career.title_igbo
                          : career.title}
                      </h2>
                      <span className="px-3 py-1 bg-light-lavender text-olive-green text-xs font-medium rounded-full">
                        {getEmploymentTypeLabel(career.employment_type)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-secondary-text mb-3">
                      {i18n.language === 'ig' && career.department_igbo
                        ? career.department_igbo
                        : career.department} • {career.location}
                    </p>
                    
                    <p className="text-secondary-text mb-4 line-clamp-2">
                      {i18n.language === 'ig' && career.description_igbo
                        ? career.description_igbo
                        : career.description}
                    </p>
                    
                    {career.salary_range && (
                      <p className="text-sm text-olive-green font-medium mb-3">
                        💰 {career.salary_range}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedCareer(career)}
                    className="px-6 py-2 bg-olive-green text-white rounded-md hover:bg-opacity-90 transition-colors whitespace-nowrap"
                  >
                    {t('careers.applyNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedCareer(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-text mb-2">
                    {i18n.language === 'ig' && selectedCareer.title_igbo
                      ? selectedCareer.title_igbo
                      : selectedCareer.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-secondary-text">
                    <span className="px-2 py-1 bg-light-lavender rounded">
                      {i18n.language === 'ig' && selectedCareer.department_igbo
                        ? selectedCareer.department_igbo
                        : selectedCareer.department}
                    </span>
                    <span>•</span>
                    <span>{selectedCareer.location}</span>
                    <span>•</span>
                    <span>{getEmploymentTypeLabel(selectedCareer.employment_type)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="text-secondary-text hover:text-primary-text"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="prose max-w-none mb-8">
                <h3 className="text-lg font-semibold text-primary-text mb-3">
                  {t('careers.responsibilities')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-secondary-text mb-6">
                  {(i18n.language === 'ig' && selectedCareer.responsibilities_igbo
                    ? selectedCareer.responsibilities_igbo
                    : selectedCareer.responsibilities
                  ).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-primary-text mb-3">
                  {t('careers.requirements')}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-secondary-text">
                  {(i18n.language === 'ig' && selectedCareer.requirements_igbo
                    ? selectedCareer.requirements_igbo
                    : selectedCareer.requirements
                  ).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {selectedCareer.salary_range && (
                <div className="bg-light-lavender p-4 rounded-lg mb-6">
                  <span className="font-semibold text-primary-text">
                    {t('careers.salary')}: 
                  </span>
                  <span className="text-olive-green font-bold ml-2">
                    {selectedCareer.salary_range}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedCareer(null);
                    onNavigate({ page: 'signup' });
                  }}
                  className="flex-1 py-3 bg-olive-green text-white rounded-md font-medium hover:bg-opacity-90 transition-colors"
                >
                  {t('careers.applyNow')}
                </button>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="px-6 py-3 border border-soft-gray rounded-md hover:bg-soft-gray transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
