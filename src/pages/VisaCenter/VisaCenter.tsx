import { useState, useEffect } from 'react';
import { CheckCircle, Circle, FileText, MessageSquare, Clock, AlertCircle, Bell, ExternalLink, X } from 'lucide-react';
import { visaAgentService } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import type { VisaReportResponse, VisaAlert } from '../../services/api/types';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface ChecklistCategory {
  category: string;
  items: ChecklistItem[];
}

interface VisaUpdate {
  id: string;
  country: string;
  visaType: string;
  dateApplied: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Approved' | 'Rejected' | 'Interview Scheduled';
}

const VisaCenter = () => {
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [visaReport, setVisaReport] = useState<VisaReportResponse | null>(null);

  // Checklists by category - populated from API
  const [checklistCategories, setChecklistCategories] = useState<ChecklistCategory[]>([]);

  // Visa alerts state
  const [alerts, setAlerts] = useState<VisaAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState<boolean>(false);

  // Fetch visa report from API
  const fetchVisaReport = async (citizenship: string, destination: string, userProfileId: number) => {
    setLoading(true);
    try {
      const response = await visaAgentService.getVisaReport(citizenship, destination, userProfileId);
      setVisaReport(response);

      // Transform checklist categories from API response
      if (response.checklist && response.checklist.length > 0) {
        const categories: ChecklistCategory[] = response.checklist.map((category) => ({
          category: category.category,
          items: category.items.map((item, index) => ({
            id: `${category.category}-${index + 1}`,
            label: item.item,
            completed: item.status === 'completed',
            priority: item.priority,
          })),
        }));
        setChecklistCategories(categories);
      }

      console.log('Visa Report loaded:', response);
    } catch (err) {
      console.error('Error fetching visa report:', err);
      ErrorHandler.log(err, 'VisaCenter - Fetch Report');
    } finally {
      setLoading(false);
    }
  };

  // Fetch visa alerts from API
  const fetchVisaAlerts = async (userProfileId: number) => {
    setAlertsLoading(true);
    try {
      const response = await visaAgentService.getVisaAlerts(userProfileId);
      setAlerts(response.alerts);
      console.log('Visa Alerts loaded:', response);
    } catch (err) {
      console.error('Error fetching visa alerts:', err);
      ErrorHandler.log(err, 'VisaCenter - Fetch Alerts');
    } finally {
      setAlertsLoading(false);
    }
  };

  // Mark alert as acknowledged
  const handleDismissAlert = async (alertId: number) => {
    try {
      await visaAgentService.markAlertsSent({
        user_profile_id: 1,
        alert_ids: [alertId],
      });
      // Remove the alert from local state
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
      ErrorHandler.log(err, 'VisaCenter - Dismiss Alert');
    }
  };

  // Mark all alerts as acknowledged
  const handleDismissAllAlerts = async () => {
    try {
      await visaAgentService.markAlertsSent({
        user_profile_id: 1,
      });
      setAlerts([]);
    } catch (err) {
      console.error('Error dismissing all alerts:', err);
      ErrorHandler.log(err, 'VisaCenter - Dismiss All Alerts');
    }
  };

  // Load visa report and alerts on component mount
  useEffect(() => {
    fetchVisaReport('Pakistani', 'Germany', 1);
    fetchVisaAlerts(1);
  }, []);

  // Visa Updates and Deadlines
  const [visaUpdates, setVisaUpdates] = useState<VisaUpdate[]>([
    {
      id: '1',
      country: 'United States',
      visaType: 'F-1 Student',
      dateApplied: '2024-09-15',
      deadline: '2024-12-01',
      status: 'In Progress',
    },
    {
      id: '2',
      country: 'United Kingdom',
      visaType: 'Tier 4 Student',
      dateApplied: '2024-09-20',
      deadline: '2024-11-30',
      status: 'Interview Scheduled',
    },
    {
      id: '3',
      country: 'Canada',
      visaType: 'Study Permit',
      dateApplied: '2024-08-10',
      deadline: '2024-11-15',
      status: 'Approved',
    },
  ]);

  const getStatusColor = (status: VisaUpdate['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
            Visa Center
          </h1>
          <p className="text-neutral-gray text-sm md:text-base">
            Track your visa applications, manage documents, and prepare for interviews
          </p>
        </div>

        {/* Visa Policy Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">
                  Visa Policy Alerts ({alerts.length})
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

        {/* Alerts Loading Indicator */}
        {alertsLoading && (
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="text-sm">Loading alerts...</span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 mt-3 text-gray-600">Loading visa checklist...</span>
          </div>
        )}

        {/* Visa Info Summary */}
        {visaReport && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-light rounded-lg">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {visaReport.visa_type}
                </h2>
                <p className="text-sm text-gray-600">
                  {visaReport.citizenship} → {visaReport.destination}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Fees</p>
                <p className="text-sm font-semibold text-gray-800">{visaReport.fees}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Processing Time</p>
                <p className="text-sm font-semibold text-gray-800">{visaReport.timeline}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Interview</p>
                <p className="text-sm font-semibold text-gray-800">
                  {visaReport.special_conditions?.includes('Interview required') ? 'Required' : 'Not Required'}
                </p>
              </div>
            </div>

            {/* Special Conditions */}
            {visaReport.special_conditions && visaReport.special_conditions.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Special Conditions:</p>
                <ul className="space-y-1">
                  {visaReport.special_conditions.map((condition, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Post Graduation Options */}
            {visaReport.post_graduation_options && visaReport.post_graduation_options.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Post-Graduation Options:</p>
                <ul className="space-y-1">
                  {visaReport.post_graduation_options.map((option, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Source Link */}
            {visaReport.source_url && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={visaReport.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Official Source →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Checklist Sections */}
        {checklistCategories.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {checklistCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-light rounded-lg">
                    {category.category.toLowerCase().includes('document') ? (
                      <FileText className="w-6 h-6 text-primary" />
                    ) : (
                      <MessageSquare className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800">{category.category}</h2>
                    <p className="text-sm text-gray-600">
                      {category.items.filter(item => item.completed).length} of {category.items.length} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round((category.items.filter(item => item.completed).length / category.items.length) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(category.items.filter(item => item.completed).length / category.items.length) * 100}%` }}
                  />
                </div>

                {/* Checklist Items */}
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      {item.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span
                          className={`${
                            item.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.priority && (
                          <span className={`ml-2 text-xs ${
                            item.priority === 'high' ? 'text-red-500' :
                            item.priority === 'medium' ? 'text-yellow-600' : 'text-gray-500'
                          }`}>
                            ({item.priority})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visa Updates and Deadlines Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-light rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Visa Updates & Deadlines</h2>
              <p className="text-sm text-gray-600">Track your visa application status</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Visa Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date Applied
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Deadline</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {visaUpdates.map((visa) => (
                  <tr
                    key={visa.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-800 font-medium">{visa.country}</td>
                    <td className="py-4 px-4 text-gray-700">{visa.visaType}</td>
                    <td className="py-4 px-4 text-gray-600">{visa.dateApplied}</td>
                    <td className="py-4 px-4 text-gray-600">{visa.deadline}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          visa.status
                        )}`}
                      >
                        {visa.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {visaUpdates.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No visa applications yet</p>
              <p className="text-gray-400 text-sm">
                Start tracking your visa applications and deadlines
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaCenter;
