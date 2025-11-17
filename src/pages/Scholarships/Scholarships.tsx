import React, { useState, useEffect } from 'react';
import { Header, MetricCards, ScholarshipsList } from '../../components/Scholarships';
import { ScholarshipData } from '../../components/Scholarships/ScholarshipCard/ScholarshipCard';
import { scholarshipService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { ScholarshipResult } from '../../services/api/types';

const Scholarships: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);

  // Transform API result to ScholarshipData format
  const transformScholarshipData = (result: ScholarshipResult): ScholarshipData => {
    // Build requirements metadata as bullet points dynamically
    const requirementPoints: { label: string }[] = [];
    const metadata = result.recommendation_metadata;

    // Helper function to format field names (snake_case to Title Case)
    const formatFieldName = (field: string): string => {
      return field
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Add required documents as requirements
    result.required_documents.forEach(doc => {
      requirementPoints.push({ label: doc });
    });

    // Iterate through all metadata fields dynamically
    Object.entries(metadata).forEach(([key, value]) => {
      // Skip null or undefined values
      if (value === null || value === undefined) {
        return;
      }

      // Format the value based on its type
      let displayValue: string;
      if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else if (Array.isArray(value)) {
        displayValue = value.length > 0 ? value.join(', ') : 'None';
      } else {
        displayValue = String(value);
      }

      // Add to requirement points
      requirementPoints.push({
        label: `${formatFieldName(key)}: ${displayValue}`
      });
    });

    // Check if deadline has passed
    const deadlineDate = new Date(result.deadline);
    const now = new Date();
    const deadlinePassed = deadlineDate < now;

    return {
      id: result.id.toString(),
      title: result.scholarship_name,
      university: result.provider,
      tags: [...result.scholarship_type, result.duration],
      description: result.why_fit,
      amount: `$${result.amount.toLocaleString()}`,
      deadline: result.deadline,
      deadlinePassed,
      recipients: `${result.recipients_count} recipients`,
      duration: result.duration,
      eligibility: result.eligibility_criteria,
      requirements: requirementPoints,
      matchPercentage: Math.round(result.match_score * 100), // Convert 0-1 to 0-100
    };
  };

  // Fetch scholarship search results with polling
  const fetchScholarships = async (userProfileId: number) => {
    setLoading(true);
    setLoadingProgress('Initiating scholarship search...');

    try {
      console.log('=== Starting Scholarship Search ===');
      console.log('Request:', { userProfileId });

      // Use the searchAndWaitForResults method with polling
      const resultsResponse = await scholarshipService.searchAndWaitForResults(
        {
          user_profile_id: userProfileId,
        },
        {
          maxAttempts: 60,
          intervalMs: 5000,
          onProgress: (attempt, maxAttempts) => {
            setLoadingProgress(`Fetching results... (${attempt}/${maxAttempts})`);
            console.log(`Polling attempt ${attempt}/${maxAttempts}`);
          },
        }
      );

      console.log('Results Response:', resultsResponse);
      console.log('Results Data:', JSON.stringify(resultsResponse, null, 2));
      console.log('=== Scholarship Search Complete ===');

      // Transform and set the scholarships data
      const transformedData = resultsResponse.results.map(transformScholarshipData);
      setScholarships(transformedData);

    } catch (err) {
      console.error('Error fetching scholarships:', err);
      ErrorHandler.log(err, 'Scholarships Page - Fetch');
      setLoadingProgress('Failed to load scholarships');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  // Load scholarships on component mount
  useEffect(() => {
    // Fetch scholarships for user profile ID 1
    fetchScholarships(1);
  }, []);

  const handleApply = (id: string) => {
    console.log('Starting application for scholarship:', id);
  };

  const handleViewDetails = (id: string) => {
    console.log('Viewing details for scholarship:', id);
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <Header />

        {/* Metric Cards */}
        <MetricCards />

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading scholarships...'}
            </span>
          </div>
        )}

        {/* Scholarships List with Tabs */}
        {!loading && scholarships.length > 0 && (
          <ScholarshipsList
            scholarships={scholarships}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* No Results */}
        {!loading && scholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No scholarships found. Try adjusting your profile or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;
