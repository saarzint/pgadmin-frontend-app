import React, { useState } from 'react';
import { Activity, Send, Loader, CheckCircle, AlertCircle, Clock, Bot } from 'lucide-react';
import { admissionsCounselorService } from '../../../services/api';
import { AdmissionsAgentReportRequest } from '../../../services/api/types';
import { ErrorHandler } from '../../../utils/errorHandler';

interface AgentReport {
  agentName: string;
  timestamp: string;
  conflictDetected: boolean;
  reportId: number;
}

interface AgentActivityCardProps {
  userId: number;
}

const AGENT_OPTIONS = [
  'University Search Agent',
  'Scholarship Search Agent',
  'Visa Information Agent',
  'Application Requirement Agent',
];

const AgentActivityCard: React.FC<AgentActivityCardProps> = ({ userId }) => {
  const [selectedAgent, setSelectedAgent] = useState(AGENT_OPTIONS[0]);
  const [payload, setPayload] = useState('{\n  "action": "search",\n  "results_count": 10\n}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentReports, setRecentReports] = useState<AgentReport[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let parsedPayload: Record<string, unknown>;
      try {
        parsedPayload = JSON.parse(payload);
      } catch {
        setError('Invalid JSON payload. Please check your input.');
        setLoading(false);
        return;
      }

      const request: AdmissionsAgentReportRequest = {
        agent_name: selectedAgent,
        user_id: userId,
        payload: parsedPayload,
        timestamp: new Date().toISOString(),
      };

      const response = await admissionsCounselorService.logAgentReport(request);

      // Add to recent reports
      setRecentReports((prev) => [
        {
          agentName: response.agent_name,
          timestamp: new Date().toISOString(),
          conflictDetected: response.conflict_detected,
          reportId: response.report_id,
        },
        ...prev.slice(0, 4), // Keep last 5
      ]);

      // Reset form
      setPayload('{\n  "action": "search",\n  "results_count": 10\n}');
      setShowForm(false);
    } catch (err) {
      ErrorHandler.log(err, 'AgentActivityCard - Log Report');
      setError('Failed to log agent report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-primary-dark" />
          <h2 className="text-lg font-bold text-primary-darkest">Agent Activity Log</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 text-xs font-medium text-primary-dark bg-primary-lightest rounded-lg hover:bg-primary-light transition-colors"
        >
          {showForm ? 'Hide Form' : 'Log Activity'}
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Agent Name
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={loading}
            >
              {AGENT_OPTIONS.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Payload (JSON)
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder='{"key": "value"}'
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={14} className="text-red-600" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={14} className="animate-spin" />
                Logging...
              </>
            ) : (
              <>
                <Send size={14} />
                Log Report
              </>
            )}
          </button>
        </form>
      )}

      {/* Recent Reports */}
      {recentReports.length === 0 ? (
        <div className="text-center py-6">
          <Bot size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-gray">No recent agent activity logged.</p>
          <p className="text-xs text-gray-400 mt-1">Use "Log Activity" to record agent reports.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Recent Activity
          </p>
          {recentReports.map((report, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                report.conflictDetected
                  ? 'bg-yellow-50 border border-yellow-100'
                  : 'bg-green-50 border border-green-100'
              }`}
            >
              {report.conflictDetected ? (
                <AlertCircle size={16} className="text-yellow-600" />
              ) : (
                <CheckCircle size={16} className="text-green-600" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-darkest truncate">
                  {report.agentName}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-gray">
                  <Clock size={10} />
                  <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
                  <span>|</span>
                  <span>ID: {report.reportId}</span>
                </div>
              </div>
              {report.conflictDetected && (
                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                  Conflict
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentActivityCard;
