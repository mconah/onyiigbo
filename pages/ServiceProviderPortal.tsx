import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { databases, dbId, account } from '../lib/appwrite';
import { Query, ID } from 'appwrite';

interface ServiceProviderApplication {
  user_id: string;
  services_offered: string[];
  hourly_rate?: string;
  qualifications: string;
  years_experience: number;
  documents: string[];
}

interface ServiceProviderPortalProps {
  user: { $id: string; role: string; name: string } | null;
}

const ServiceProviderPortal: React.FC<ServiceProviderPortalProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<'not_applied' | 'pending' | 'verified' | 'rejected'>('not_applied');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ServiceProviderApplication>({
    user_id: user?.$id || '',
    services_offered: [],
    hourly_rate: '',
    qualifications: '',
    years_experience: 0,
    documents: [],
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const servicesList = [
    { id: 'translation', label: i18n.language === 'ig' ? 'Ntụgharị' : 'Translation', labelEn: 'Translation' },
    { id: 'tutoring', label: i18n.language === 'ig' ? 'Nkuzi' : 'Tutoring', labelEn: 'Tutoring' },
    { id: 'content_creation', label: i18n.language === 'ig' ? 'Nhazi Akụkọ' : 'Content Creation', labelEn: 'Content Creation' },
    { id: 'cultural_events', label: i18n.language === 'ig' ? 'Mmemme Ọdịnala' : 'Cultural Events', labelEn: 'Cultural Events' },
    { id: 'interpretation', label: i18n.language === 'ig' ? 'Ntụgharị Ọnụ' : 'Interpretation', labelEn: 'Interpretation' },
    { id: 'consulting', label: i18n.language === 'ig' ? 'Nduzi' : 'Consulting', labelEn: 'Consulting' },
  ];

  useEffect(() => {
    if (user) {
      checkVerificationStatus();
    }
  }, [user]);

  const checkVerificationStatus = async () => {
    try {
      const response = await databases.listDocuments(
        dbId,
        'service_providers',
        [Query.equal('user_id', user!.$id)]
      );

      if (response.documents.length > 0) {
        const provider = response.documents[0];
        setStatus(provider.verification_status as 'verified' | 'pending' | 'rejected');
        if (provider.verification_status === 'rejected') {
          // Load rejection reason from verification_requests
          const requests = await databases.listDocuments(
            dbId,
            'verification_requests',
            [
              Query.equal('user_id', user!.$id),
              Query.equal('request_type', 'service_provider'),
              Query.orderDesc('reviewed_at'),
              Query.limit(1),
            ]
          );
          if (requests.documents.length > 0) {
            setRejectionReason(requests.documents[0].rejection_reason || '');
          }
        }
      } else {
        // Check for pending verification request
        const requests = await databases.listDocuments(
          dbId,
          'verification_requests',
          [
            Query.equal('user_id', user!.$id),
            Query.equal('request_type', 'service_provider'),
          ]
        );
        if (requests.documents.length > 0) {
          setStatus(requests.documents[0].status as 'pending' | 'rejected');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(serviceId)
        ? prev.services_offered.filter(s => s !== serviceId)
        : [...prev.services_offered, serviceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.services_offered.length === 0) {
      setMessage({ type: 'error', text: i18n.language === 'ig' ? 'Họrọ ọrụ ole na ole' : 'Please select at least one service' });
      return;
    }

    setSubmitting(true);
    try {
      // Create verification request
      await databases.createDocument(dbId, 'verification_requests', ID.unique(), {
        user_id: user.$id,
        request_type: 'service_provider',
        status: 'Pending',
        submitted_at: new Date().toISOString(),
        documents: formData.documents,
        notes: `Services: ${formData.services_offered.join(', ')}, Experience: ${formData.years_experience} years, Rate: ${formData.hourly_rate}`,
      });

      // Create service provider entry
      await databases.createDocument(dbId, 'service_providers', ID.unique(), {
        user_id: user.$id,
        services_offered: formData.services_offered,
        hourly_rate: formData.hourly_rate,
        qualifications: formData.qualifications,
        years_experience: formData.years_experience,
        verification_status: 'Pending',
        verification_documents: formData.documents,
        rating: 0,
        total_reviews: 0,
        completed_jobs: 0,
      });

      setStatus('pending');
      setMessage({ type: 'success', text: i18n.language === 'ig' ? 'Akwụkwọ gị ejirila! Ndị nchịkwa ga-enyocha ya.' : 'Application submitted! Admins will review it.' });
    } catch (error) {
      console.error('Error submitting application:', error);
      setMessage({ type: 'error', text: i18n.language === 'ig' ? 'Mmehie na-ewe akwụkwọ. Nwaa ọzọ.' : 'Error submitting application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-green"></div>
      </div>
    );
  }

  // Verified Provider Dashboard
  if (status === 'verified') {
    return (
      <div className="min-h-screen bg-light-lavender py-12">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">✅</span>
              <div>
                <h1 className="text-2xl font-bold text-primary-text font-unica-one">
                  {t('serviceProvider.title')}
                </h1>
                <p className="text-green-600 font-medium">
                  {i18n.language === 'ig' ? 'E kwadoro gị!' : 'You are verified!'}
                </p>
              </div>
            </div>
            <p className="text-secondary-text">
              {i18n.language === 'ig'
                ? 'Ị nwere ohere iji mee ọrụ na sọsọ. Ị nwere ike ịbata ike na ihe ndị na-arụ ọrụ.'
                : 'You now have full access to the platform. You can accept service requests and interact with clients.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pending Verification
  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-light-lavender py-12">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <span className="text-6xl mb-4 block">⏳</span>
            <h1 className="text-2xl font-bold text-primary-text font-unica-one mb-4">
              {t('serviceProvider.pending')}
            </h1>
            <p className="text-secondary-text mb-4">
              {t('serviceProvider.waitApproval')}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                {i18n.language === 'ig'
                  ? 'Akwụkwọ gị nọ na nlebara anya. Anyị ga-akpọtụrụ gị mgbe e mechara.'
                  : 'Your application is under review. We will contact you once complete.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rejected Application
  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-light-lavender py-12">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">❌</span>
              <div>
                <h1 className="text-2xl font-bold text-primary-text font-unica-one">
                  {t('serviceProvider.rejected')}
                </h1>
              </div>
            </div>
            {rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">
                  {i18n.language === 'ig' ? 'Ihe kpatara e jiri jụ akwụkwọ gị:' : 'Reason for rejection:'}
                </h3>
                <p className="text-red-700">{rejectionReason}</p>
              </div>
            )}
            <p className="text-secondary-text mb-6">
              {i18n.language === 'ig'
                ? 'Ị nwere ike ị tinye akwụkwọ ọzọ ma ọ bụ kpọtụrụ ndị nchịkwa maka ozi ndị ọzọ.'
                : 'You can reapply or contact admins for more information.'}
            </p>
            <button
              onClick={() => setStatus('not_applied')}
              className="px-6 py-2 bg-olive-green text-white rounded-md hover:bg-opacity-90"
            >
              {i18n.language === 'ig' ? 'Tinye akwụkwọ ọzọ' : 'Reapply'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Application Form
  return (
    <div className="min-h-screen bg-light-lavender py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-primary-text font-unica-one mb-2">
            {t('serviceProvider.title')}
          </h1>
          <p className="text-secondary-text mb-6">
            {t('serviceProvider.verificationNeeded')}
          </p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Services Offered */}
            <div>
              <label className="block text-sm font-medium text-primary-text mb-3">
                {i18n.language === 'ig' ? 'Ọrụ ị ga-enye' : 'Services you offer'} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {servicesList.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceToggle(service.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      formData.services_offered.includes(service.id)
                        ? 'border-olive-green bg-olive-green bg-opacity-10'
                        : 'border-soft-gray hover:border-olive-green'
                    }`}
                  >
                    <span className="text-sm font-medium">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourly-rate" className="block text-sm font-medium text-primary-text mb-2">
                {i18n.language === 'ig' ? 'Ọnụ ego kwa awa (na-achọ)' : 'Hourly Rate (optional)'}
              </label>
              <input
                type="text"
                id="hourly-rate"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                placeholder={i18n.language === 'ig' ? 'Dị ka: ₦5,000 / awa' : 'e.g., ₦5,000 / hour'}
                className="w-full px-4 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green"
              />
            </div>

            {/* Qualifications */}
            <div>
              <label htmlFor="qualifications" className="block text-sm font-medium text-primary-text mb-2">
                {i18n.language === 'ig' ? 'Akụkọ ọmụmụ gị' : 'Your Qualifications'} *
              </label>
              <textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                rows={4}
                required
                placeholder={i18n.language === 'ig'
                  ? 'Kọwaa akụkọ ọmụmụ gị na ihe ndị ọzọ mere ka ị bụrụ onye nkuzi Igbo...'
                  : 'Describe your qualifications and experience with Igbo language...'}
                className="w-full px-4 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-primary-text mb-2">
                {i18n.language === 'ig' ? 'Ahọ dị ka ọrụ' : 'Years of Experience'} *
              </label>
              <input
                type="number"
                id="experience"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                min={0}
                required
                className="w-full px-4 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green"
              />
            </div>

            {/* Document Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">
                {t('serviceProvider.submitDocuments')}
              </label>
              <div className="border-2 border-dashed border-soft-gray rounded-lg p-6 text-center">
                <span className="text-4xl mb-2 block">📄</span>
                <p className="text-sm text-secondary-text mb-2">
                  {i18n.language === 'ig'
                    ? 'Na-ebubata akwụkwọ: akwụkwọ nkụzi, CV, ma ọ bụ ihe akaebe ndị ọzọ'
                    : 'Upload documents: certificates, CV, or other credentials'}
                </p>
                <p className="text-xs text-gray-500">
                  {i18n.language === 'ig'
                    ? '(Na-abịakarị nke ọma - nyefee nke a n\'ime dashboard gị)'
                    : '(Coming soon - upload this in your dashboard)'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-olive-green text-white rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {submitting
                ? t('common.loading')
                : t('serviceProvider.apply')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderPortal;
