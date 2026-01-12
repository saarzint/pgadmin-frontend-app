import React, { useState } from 'react';
import {
  Search,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader,
  XCircle,
  Info
} from 'lucide-react';
import { applicationRequirementsService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import { useProfile } from '../../services/supabase';
import type {
  FetchApplicationRequirementsResponse
} from '../../services/api/types';

const ApplicationRequirements: React.FC = () => {
  const { profileId } = useProfile();
  const [university, setUniversity] = useState<string>('');
  const [program, setProgram] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [requirements, setRequirements] = useState<FetchApplicationRequirementsResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleFetchRequirements = async () => {
    if (!university.trim() || !program.trim()) {
      setError('Please enter both university and program name');
      return;
    }

    if (!profileId) {
      setError('Please complete your profile first.');
      return;
    }

    setLoading(true);
    setError('');
    setLoadingMessage('Fetching application requirements...');

    try {
      // Fetch the requirements
      const response: FetchApplicationRequirementsResponse =
        await applicationRequirementsService.fetchRequirements({
          user_profile_id: profileId,
          university: university.trim(),
          program: program.trim(),
        });

      console.log('Fetch Response:', response);
      setRequirements(response);
    } catch (err) {
      console.error('Error fetching application requirements:', err);
      ErrorHandler.log(err, 'ApplicationRequirements - Fetch');
      setError('Failed to fetch application requirements. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const formatDeadline = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Not specified';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const hasDeadlines = requirements?.formatted_json.deadlines && (
    requirements.formatted_json.deadlines.regular_decision ||
    requirements.formatted_json.deadlines.early_action ||
    requirements.formatted_json.deadlines.early_decision ||
    requirements.formatted_json.deadlines.priority ||
    requirements.formatted_json.deadlines.rolling
  );

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
            Application Requirements
          </h1>
          <p className="text-neutral-gray text-sm md:text-base">
            Get detailed application requirements for universities and programs
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                University Name
              </label>
              <input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g., University of Hull, Stanford"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                Program Name
              </label>
              <input
                id="program"
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g., Computer Science, Artificial Intelligence"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={loading}
              />
            </div>
          </div>

          <button
            onClick={handleFetchRequirements}
            disabled={loading}
            className={`
              w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3
              rounded-lg font-medium text-white transition-all duration-200
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg'
              }
            `}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>{loadingMessage || 'Loading...'}</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Get Requirements</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Requirements Display */}
        {requirements && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-primary-lightest to-blue-50 rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {requirements.formatted_json.university}
              </h2>
              <p className="text-lg text-gray-700 mb-3">{requirements.formatted_json.program}</p>
              {requirements.formatted_json.application_platform && (
                <div className="inline-block px-3 py-1 bg-white rounded-full text-sm font-medium text-primary border border-primary">
                  Platform: {requirements.formatted_json.application_platform}
                </div>
              )}
            </div>

            {/* Ambiguity Warning */}
            {requirements.formatted_json.is_ambiguous && requirements.formatted_json.ambiguity_details && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">Incomplete Information</p>
                  <p className="text-sm text-yellow-700">{requirements.formatted_json.ambiguity_details}</p>
                </div>
              </div>
            )}

            {/* Deadlines */}
            {hasDeadlines && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Application Deadlines</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requirements.formatted_json.deadlines?.regular_decision && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Regular Decision</p>
                      <p className="font-semibold text-gray-800">
                        {formatDeadline(requirements.formatted_json.deadlines.regular_decision)}
                      </p>
                    </div>
                  )}
                  {requirements.formatted_json.deadlines?.early_action && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Early Action</p>
                      <p className="font-semibold text-gray-800">
                        {formatDeadline(requirements.formatted_json.deadlines.early_action)}
                      </p>
                    </div>
                  )}
                  {requirements.formatted_json.deadlines?.early_decision && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Early Decision</p>
                      <p className="font-semibold text-gray-800">
                        {formatDeadline(requirements.formatted_json.deadlines.early_decision)}
                      </p>
                    </div>
                  )}
                  {requirements.formatted_json.deadlines?.priority && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Priority</p>
                      <p className="font-semibold text-gray-800">
                        {formatDeadline(requirements.formatted_json.deadlines.priority)}
                      </p>
                    </div>
                  )}
                  {requirements.formatted_json.deadlines?.rolling && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Rolling Admissions</p>
                      <p className="font-semibold text-gray-800">Yes</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {requirements.formatted_json.required_documents && requirements.formatted_json.required_documents.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Required Documents</h3>
                </div>
                <ul className="space-y-2">
                  {requirements.formatted_json.required_documents.map((doc, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {doc.required ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <span className={`${doc.required ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                          {doc.name}
                        </span>
                        {doc.details && (
                          <p className="text-sm text-gray-600 mt-1">{doc.details}</p>
                        )}
                      </div>
                      {doc.required && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Required
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Essay Prompts */}
            {requirements.formatted_json.essay_prompts && requirements.formatted_json.essay_prompts.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Essay Prompts</h3>
                </div>
                <div className="space-y-4">
                  {requirements.formatted_json.essay_prompts.map((essayPrompt, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      {essayPrompt.type && (
                        <p className="text-sm font-medium text-primary mb-2 capitalize">
                          {essayPrompt.type.replace(/_/g, ' ')}
                        </p>
                      )}
                      <p className="text-gray-700 mb-2">{essayPrompt.prompt}</p>
                      {essayPrompt.word_limit && (
                        <p className="text-sm text-gray-500">
                          Word limit: {essayPrompt.word_limit} words
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Portfolio */}
              {requirements.formatted_json.portfolio && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Required</p>
                      <p className="font-semibold text-gray-800">
                        {requirements.formatted_json.portfolio.required ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {requirements.formatted_json.portfolio.details && (
                      <div>
                        <p className="text-sm text-gray-600">Details</p>
                        <p className="text-gray-700">{requirements.formatted_json.portfolio.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Interview */}
              {requirements.formatted_json.interview && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Interview</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Required</p>
                      <p className="font-semibold text-gray-800">
                        {requirements.formatted_json.interview.required ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {requirements.formatted_json.interview.policy && (
                      <div>
                        <p className="text-sm text-gray-600">Policy</p>
                        <p className="text-gray-700">{requirements.formatted_json.interview.policy}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fee Information */}
              {requirements.formatted_json.fee_info && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Fee Information</h3>
                  </div>
                  <div className="space-y-3">
                    {requirements.formatted_json.fee_info.amount && (
                      <div>
                        <p className="text-sm text-gray-600">Application Fee</p>
                        <p className="font-semibold text-gray-800">
                          {requirements.formatted_json.fee_info.amount}
                          {requirements.formatted_json.fee_info.currency && ` ${requirements.formatted_json.fee_info.currency}`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Fee Waiver Available</p>
                      <p className="font-semibold text-gray-800">
                        {requirements.formatted_json.fee_info.waiver_available ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {requirements.formatted_json.fee_info.waiver_details && (
                      <div>
                        <p className="text-sm text-gray-600">Waiver Details</p>
                        <p className="text-gray-700">{requirements.formatted_json.fee_info.waiver_details}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Test Policy */}
              {requirements.formatted_json.test_policy && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Test Policy</h3>
                  <div className="space-y-3">
                    {requirements.formatted_json.test_policy.type && (
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold text-gray-800">{requirements.formatted_json.test_policy.type}</p>
                      </div>
                    )}
                    {requirements.formatted_json.test_policy.details && (
                      <div>
                        <p className="text-sm text-gray-600">Details</p>
                        <p className="text-gray-700">{requirements.formatted_json.test_policy.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Source Link */}
            {requirements.formatted_json.source_url && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <a
                  href={requirements.formatted_json.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Official Requirements Page</span>
                </a>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Disclaimer:</strong> All information is sourced from the official university website.
                Please verify all requirements before submitting your application.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationRequirements;
