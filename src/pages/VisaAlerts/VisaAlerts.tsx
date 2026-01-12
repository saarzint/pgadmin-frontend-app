import { useState, useEffect } from 'react';
import { Bell, ExternalLink, X } from 'lucide-react';
import { visaAgentService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import { useProfile } from '../../services/supabase';
import type { VisaAlert } from '../../services/api/types';

const VisaAlerts = () => {
  const { profileId } = useProfile();
  // Visa alerts state
  const [alerts, setAlerts] = useState<VisaAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState<boolean>(false);

  // Fetch visa alerts from API
  const fetchVisaAlerts = async (userProfileId: number) => {
    setAlertsLoading(true);
    try {
      const response = await visaAgentService.getVisaAlerts(userProfileId);
      setAlerts(response.alerts);
      console.log('Visa Alerts loaded:', response);
    } catch (err) {
      console.error('Error fetching visa alerts:', err);
      ErrorHandler.log(err, 'VisaAlerts - Fetch Alerts');
    } finally {
      setAlertsLoading(false);
    }
  };

  // Mark alert as acknowledged
  const handleDismissAlert = async (alertId: number) => {
    if (!profileId) return;
    try {
      await visaAgentService.markAlertsSent({
        user_profile_id: profileId,
        alert_ids: [alertId],
      });
      // Remove the alert from local state
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
      ErrorHandler.log(err, 'VisaAlerts - Dismiss Alert');
    }
  };

  // Mark all alerts as acknowledged
  const handleDismissAllAlerts = async () => {
    if (!profileId) return;
    try {
      await visaAgentService.markAlertsSent({
        user_profile_id: profileId,
      });
      setAlerts([]);
    } catch (err) {
      console.error('Error dismissing all alerts:', err);
      ErrorHandler.log(err, 'VisaAlerts - Dismiss All Alerts');
    }
  };

  // Load visa alerts on component mount
  useEffect(() => {
    if (profileId) {
      fetchVisaAlerts(profileId);
    }
  }, [profileId]);

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
            Visa Alerts
          </h1>
          <p className="text-neutral-gray text-sm md:text-base">
            Stay updated with the latest visa policy changes and important notifications
          </p>
        </div>

        {/* Alerts Loading Indicator */}
        {alertsLoading && (
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="text-sm">Loading alerts...</span>
          </div>
        )}

        {/* Visa Policy Alerts Section */}
        {!alertsLoading && alerts.length > 0 && (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">
                  Active Visa Policy Alerts ({alerts.length})
                </h3>
              </div>
              <button
                onClick={handleDismissAllAlerts}
                className="text-xs text-yellow-700 hover:text-yellow-900 underline"
              >
                Dismiss All
              </button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-lg border border-yellow-200 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {alert.citizenship} → {alert.destination}
                        </span>
                        {alert.is_new && (
                          <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.alert_message}</p>
                      {alert.changes && alert.changes.length > 0 && (
                        <ul className="space-y-1 mb-2">
                          {alert.changes.slice(0, 3).map((change, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-yellow-600">•</span>
                              <span className="capitalize">{change.field.replace(/_/g, ' ')}</span>
                              <span className="text-gray-400">({change.change_type})</span>
                            </li>
                          ))}
                          {alert.changes.length > 3 && (
                            <li className="text-xs text-gray-500">
                              +{alert.changes.length - 3} more changes
                            </li>
                          )}
                        </ul>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{alert.visa_type}</span>
                        <span>•</span>
                        <span>
                          Updated: {new Date(alert.last_updated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {alert.source_url && (
                          <>
                            <span>•</span>
                            <a
                              href={alert.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Source
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!alertsLoading && alerts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg mb-1">No Active Alerts</p>
            <p className="text-gray-400 text-sm">
              You're all caught up! We'll notify you when there are new visa policy updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaAlerts;
