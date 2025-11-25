import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { VisaAgentList } from '../../components/VisaAgent';
import { VisaAgentData } from '../../components/VisaAgent/VisaAgentCard/VisaAgentCard';
import { visaAgentService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { VisaInfoResult } from '../../services/api/types';

const VisaAgent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [visas, setVisas] = useState<VisaAgentData[]>([]);

  // Transform API result to VisaAgentData format
  const transformVisaData = (result: VisaInfoResult): VisaAgentData => {
    // Parse notes if it's a JSON string
    let parsedNotes: string[] = [];
    if (typeof result.notes === 'string') {
      try {
        const parsed = JSON.parse(result.notes);
        parsedNotes = Array.isArray(parsed) ? parsed : [];
      } catch {
        parsedNotes = result.notes ? [result.notes] : [];
      }
    } else if (Array.isArray(result.notes)) {
      parsedNotes = result.notes;
    }

    return {
      id: result.id.toString(),
      citizenshipCountry: result.citizenship_country,
      destinationCountry: result.destination_country,
      visaType: result.visa_type,
      documents: Array.isArray(result.documents) ? result.documents : [],
      processSteps: Array.isArray(result.process_steps) ? result.process_steps : [],
      fees: result.fees || 'Not specified',
      timelines: result.timelines || 'Not specified',
      interview: result.interview ?? false,
      postGraduation: Array.isArray(result.post_graduation) ? result.post_graduation : [],
      sourceUrl: result.source_url || '',
      disclaimer: result.disclaimer || '',
      notes: parsedNotes,
      fetchedAt: result.fetched_at,
      lastUpdated: result.last_updated,
      alertSent: result.alert_sent ?? false,
      changeSummary: {
        isNew: result.change_summary?.is_new ?? false,
        alertNeeded: result.change_summary?.alert_needed ?? false,
        hasChanges: result.change_summary?.has_changes ?? false,
        changes: Array.isArray(result.change_summary?.changes)
          ? result.change_summary.changes.map(change => ({
              field: change.field,
              newValue: change.new_value,
              oldValue: change.old_value,
              changeType: change.change_type,
            }))
          : [],
      },
    };
  };

  // Fetch visa information
  const fetchVisaInfo = async (userProfileId: number, citizenship: string, destination: string, refresh: boolean = false) => {
    setLoading(true);
    setLoadingProgress(refresh ? 'Refreshing visa information from source...' : 'Retrieving visa information...');

    try {
      console.log('=== Starting Visa Info Retrieval ===');
      console.log('User Profile ID:', userProfileId);
      console.log('Citizenship:', citizenship);
      console.log('Destination:', destination);
      console.log('Refresh:', refresh);

      setLoadingProgress(refresh ? 'Fetching latest visa requirements...' : 'Fetching visa requirements...');
      const response = await visaAgentService.getVisaInfo({
        user_profile_id: userProfileId,
        citizenship: citizenship,
        destination: destination,
        refresh: refresh,
      });

      console.log('Visa Info Response:', response);
      console.log('Total Results:', response.count);
      console.log('Agent Refresh Attempted:', response.agent_refresh_attempted);
      console.log('=== Visa Info Retrieval Complete ===');

      // Transform and set the visa data
      const transformedData = response.results.map(transformVisaData);
      setVisas(transformedData);

    } catch (err) {
      console.error('Error fetching visa info:', err);
      ErrorHandler.log(err, 'VisaAgent Page - Fetch');
      setLoadingProgress('Failed to load visa information');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchVisaInfo(1, 'Pakistani', 'Germany', true);
  };

  // Load visa info on component mount
  useEffect(() => {
    // Default values - can be made dynamic later with form inputs
    fetchVisaInfo(1, 'Pakistani', 'Germany');
  }, []);

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header with Refresh Button */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
                Visa Agent
              </h1>
              <p className="text-neutral-gray text-sm md:text-base">
                Get comprehensive visa information and requirements for your destination
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                }
              `}
              title="Refresh visa information from source"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading visa information...'}
            </span>
          </div>
        )}

        {/* Visa List */}
        {!loading && visas.length > 0 && (
          <VisaAgentList visas={visas} />
        )}

        {/* No Results */}
        {!loading && visas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No visa information found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaAgent;
