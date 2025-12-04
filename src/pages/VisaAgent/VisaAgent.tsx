import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
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

  // State to track if search has been initiated
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  // State for search inputs
  const [citizenship, setCitizenship] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  // Handle start search button click
  const handleStartSearch = () => {
    const citizenshipValue = citizenship.trim() || 'Pakistani';
    const destinationValue = destination.trim() || 'Germany';
    setSearchInitiated(true);
    fetchVisaInfo(1, citizenshipValue, destinationValue);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    const citizenshipValue = citizenship.trim() || 'Pakistani';
    const destinationValue = destination.trim() || 'Germany';
    fetchVisaInfo(1, citizenshipValue, destinationValue, true);
  };

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
            {searchInitiated && (
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
            )}
          </div>
        </div>

        {/* Start Search Section - Shows when search hasn't been initiated */}
        {!searchInitiated && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Search for Visa Information
              </h2>
              <p className="text-gray-600 max-w-md">
                Enter your citizenship and destination country to get comprehensive visa requirements.
              </p>
            </div>
            
            {/* Search Inputs */}
            <div className="w-full max-w-lg px-4 mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Citizenship</label>
                <input
                  type="text"
                  value={citizenship}
                  onChange={(e) => setCitizenship(e.target.value)}
                  placeholder="e.g., Pakistani, Indian, Nigerian..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Germany, USA, UK, Canada..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleStartSearch()}
                />
              </div>
            </div>
            
            <button
              onClick={handleStartSearch}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Search className="w-5 h-5" />
              <span>Start Visa Search</span>
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">
              {loadingProgress || 'Loading visa information...'}
            </span>
          </div>
        )}

        {/* Search Again Section - Shows after search is done */}
        {!loading && searchInitiated && (
          <div className="flex flex-col sm:flex-row items-end gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-medium text-gray-600 mb-1">Citizenship</label>
              <input
                type="text"
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                placeholder="e.g., Pakistani"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-medium text-gray-600 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Germany"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleStartSearch()}
              />
            </div>
            <button
              onClick={handleStartSearch}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm font-medium whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Search Again</span>
            </button>
          </div>
        )}

        {/* Visa List */}
        {!loading && searchInitiated && visas.length > 0 && (
          <VisaAgentList visas={visas} />
        )}

        {/* No Results - Only show after search has been initiated */}
        {!loading && searchInitiated && visas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No visa information found. Try different countries.</p>
            <button
              onClick={() => setSearchInitiated(false)}
              className="mt-4 px-4 py-2 text-primary hover:underline"
            >
              ← Back to search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaAgent;
