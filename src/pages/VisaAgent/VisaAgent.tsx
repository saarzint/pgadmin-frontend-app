import React, { useState, useEffect } from 'react';
import { Header, VisaAgentList } from '../../components/VisaAgent';
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
  const fetchVisaInfo = async (userProfileId: number, citizenship: string, destination: string) => {
    setLoading(true);
    setLoadingProgress('Retrieving visa information...');

    try {
      console.log('=== Starting Visa Info Retrieval ===');
      console.log('User Profile ID:', userProfileId);
      console.log('Citizenship:', citizenship);
      console.log('Destination:', destination);

      setLoadingProgress('Fetching visa requirements...');
      const response = await visaAgentService.getVisaInfo({
        user_profile_id: userProfileId,
        citizenship: citizenship,
        destination: destination,
        refresh: true,
      });

      console.log('Visa Info Response:', response);
      console.log('Total Results:', response.count);
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

  // Load visa info on component mount
  useEffect(() => {
    // Default values - can be made dynamic later with form inputs
    fetchVisaInfo(1, 'Pakistani', 'Germany');
  }, []);

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <Header />

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
