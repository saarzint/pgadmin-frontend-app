import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Header,
  SummaryCard,
  NextStepsCard,
  StressFlagsCard,
  OverviewCard,
  ActiveAgentsCard,
  ApproachingDeadlinesCard,
  MissingProfileFieldsCard,
  NextStepsModal,
  UpdateStageModal,
  AgentActivityCard,
} from '../../components/AdmissionsCounselor';
import { admissionsCounselorService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type {
  AdmissionsSummaryResponse,
  AdmissionsNextStep,
  AdmissionsStressFlags,
  AdmissionsOverview,
  AdmissionsApproachingDeadline,
} from '../../services/api/types';

const AdmissionsCounselor: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Summary data
  const [currentStage, setCurrentStage] = useState<string>('');
  const [progressScore, setProgressScore] = useState<number>(0);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [stressFlags, setStressFlags] = useState<AdmissionsStressFlags>({
    incomplete_profile: false,
    approaching_deadlines: false,
    agent_conflicts: false,
    missing_documents: 0,
  });
  const [nextSteps, setNextSteps] = useState<AdmissionsNextStep[]>([]);
  const [overview, setOverview] = useState<AdmissionsOverview>({
    universities_found: 0,
    scholarships_found: 0,
    application_requirements: 0,
    visa_info_count: 0,
    profile_name: '',
  });
  const [advice, setAdvice] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [missingProfileFields, setMissingProfileFields] = useState<string[]>([]);
  const [approachingDeadlines, setApproachingDeadlines] = useState<AdmissionsApproachingDeadline[]>([]);

  // Modal states
  const [showNextStepsModal, setShowNextStepsModal] = useState(false);
  const [showUpdateStageModal, setShowUpdateStageModal] = useState(false);

  // Fetch admissions summary
  const fetchSummary = async (userId: number) => {
    setLoading(true);
    setError(null);
    setLoadingProgress('Loading your admissions dashboard...');

    try {
      console.log('=== Fetching Admissions Summary ===');
      console.log('User ID:', userId);

      const response: AdmissionsSummaryResponse = await admissionsCounselorService.getSummary(userId);

      console.log('Summary Response:', response);

      // Update state with response data
      setCurrentStage(response.current_stage || 'Not Started');
      setProgressScore(response.progress_score || 0);
      setActiveAgents(response.active_agents || []);
      setStressFlags(response.stress_flags || {
        incomplete_profile: false,
        approaching_deadlines: false,
        agent_conflicts: false,
        missing_documents: 0,
      });
      setNextSteps(response.next_steps || []);
      setOverview(response.overview || {
        universities_found: 0,
        scholarships_found: 0,
        application_requirements: 0,
        visa_info_count: 0,
        profile_name: '',
      });
      setAdvice(response.advice || '');
      setLastUpdated(response.last_updated || new Date().toISOString());
      setMissingProfileFields(response.missing_profile_fields || []);
      setApproachingDeadlines(response.approaching_deadlines_details || []);

      console.log('=== Admissions Summary Loaded ===');

    } catch (err) {
      console.error('Error fetching admissions summary:', err);
      ErrorHandler.log(err, 'AdmissionsCounselor Page - Fetch Summary');
      setError('Failed to load admissions dashboard. Please try again.');
      setLoadingProgress('Failed to load dashboard');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  // Handle start search
  const handleStartSearch = () => {
    console.log('Loading dashboard with query:', searchQuery || 'Default profile');
    setSearchInitiated(true);
    fetchSummary(1);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchSummary(1);
  };

  const USER_ID = 1; // Default user ID for modals

  if (error) {
    return (
      <div className="min-h-screen bg-white py-4">
        <div className="w-full px-6">
          <Header />
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <Header
          lastUpdated={lastUpdated}
          onRefresh={searchInitiated ? handleRefresh : undefined}
          loading={loading}
        />

        {/* Start Search Section - Shows when search hasn't been initiated */}
        {!searchInitiated && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Load Admissions Dashboard
              </h2>
              <p className="text-gray-600 max-w-md">
                Enter your focus area or leave empty to load your complete admissions dashboard.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full max-w-lg px-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Application deadlines, University recommendations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleStartSearch()}
              />
            </div>
            
            <button
              onClick={handleStartSearch}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Search className="w-5 h-5" />
              <span>Load Dashboard</span>
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading admissions dashboard...'}
            </span>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && searchInitiated && (
          <div className="space-y-6">
            {/* Missing Profile Fields Alert */}
            {missingProfileFields.length > 0 && (
              <MissingProfileFieldsCard missingFields={missingProfileFields} />
            )}

            {/* Overview Cards Row */}
            <OverviewCard overview={overview} />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Summary and Active Agents */}
              <div className="space-y-6">
                <SummaryCard
                  currentStage={currentStage}
                  progressScore={progressScore}
                  advice={advice}
                  onEditStage={() => setShowUpdateStageModal(true)}
                />
                <ActiveAgentsCard activeAgents={activeAgents} />
                <AgentActivityCard userId={USER_ID} />
              </div>

              {/* Middle Column - Next Steps and Deadlines */}
              <div className="space-y-6">
                <NextStepsCard
                  nextSteps={nextSteps}
                  onViewAll={() => setShowNextStepsModal(true)}
                />
              </div>

              {/* Right Column - Stress Flags and Approaching Deadlines */}
              <div className="space-y-6">
                <StressFlagsCard
                  stressFlags={stressFlags}
                  deadlinesCount={approachingDeadlines.length}
                />
                {approachingDeadlines.length > 0 && (
                  <ApproachingDeadlinesCard deadlines={approachingDeadlines} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <NextStepsModal
          isOpen={showNextStepsModal}
          onClose={() => setShowNextStepsModal(false)}
          userId={USER_ID}
        />

        <UpdateStageModal
          isOpen={showUpdateStageModal}
          onClose={() => setShowUpdateStageModal(false)}
          userId={USER_ID}
          currentStage={currentStage}
          currentScore={progressScore}
          onUpdate={handleRefresh}
        />
      </div>
    </div>
  );
};

export default AdmissionsCounselor;
