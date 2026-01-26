/**
 * Discovery Section Page
 * Renders the appropriate discovery section based on URL param
 */

import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useUIStore, SECTION_ORDER, SECTION_INFO } from '@/stores';
import type { ProfileSection } from '@/types';

// Map URL slugs to section IDs
const SLUG_TO_SECTION: Record<string, ProfileSection> = {
  'basic-context': 'basicContext',
  'retirement-vision': 'retirementVision',
  'planning-preferences': 'planningPreferences',
  'risk-comfort': 'riskComfort',
  'financial-snapshot': 'financialSnapshot',
};

// Map section IDs to URL slugs
const SECTION_TO_SLUG: Record<ProfileSection, string> = {
  basicContext: 'basic-context',
  retirementVision: 'retirement-vision',
  planningPreferences: 'planning-preferences',
  riskComfort: 'risk-comfort',
  financialSnapshot: 'financial-snapshot',
};

export function DiscoverySection() {
  const { section: sectionSlug } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { goToSection, completeSection } = useUIStore();

  // Validate section slug
  if (!sectionSlug || !SLUG_TO_SECTION[sectionSlug]) {
    return <Navigate to="/consumer/discovery" replace />;
  }

  const currentSection = SLUG_TO_SECTION[sectionSlug];
  const sectionInfo = SECTION_INFO[currentSection];
  const currentIndex = SECTION_ORDER.indexOf(currentSection);
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === SECTION_ORDER.length - 1;

  const handleNext = () => {
    completeSection(currentSection);
    if (isLastSection) {
      navigate('/consumer/profile');
    } else {
      const nextSection = SECTION_ORDER[currentIndex + 1];
      goToSection(nextSection);
      navigate(`/consumer/discovery/${SECTION_TO_SLUG[nextSection]}`);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSection) {
      const prevSection = SECTION_ORDER[currentIndex - 1];
      goToSection(prevSection);
      navigate(`/consumer/discovery/${SECTION_TO_SLUG[prevSection]}`);
    }
  };

  const handleSaveAndExit = () => {
    navigate('/consumer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Step {currentIndex + 1} of {SECTION_ORDER.length}
            </div>
            <button
              onClick={handleSaveAndExit}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Save & Exit
            </button>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / SECTION_ORDER.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-gray-900">{sectionInfo.title}</h1>
          <p className="mt-2 text-gray-600">{sectionInfo.description}</p>

          {/* Placeholder for section form */}
          <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">
              Section form will be implemented in Phase {currentIndex + 5}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              This is a placeholder for the {sectionInfo.title} form fields
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstSection}
              className={`rounded-lg px-6 py-2 font-medium ${
                isFirstSection
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLastSection ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
