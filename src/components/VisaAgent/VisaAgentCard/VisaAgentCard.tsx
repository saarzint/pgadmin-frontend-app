import React from 'react';
import {
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Briefcase,
  ListChecks
} from 'lucide-react';

export interface VisaChangeData {
  field: string;
  newValue: string | string[];
  oldValue: string | string[];
  changeType: string;
}

export interface VisaChecklistDocumentData {
  item: string;
  required: boolean;
  notes: string;
}

export interface VisaChecklistData {
  documents: VisaChecklistDocumentData[];
  processSteps: string[];
  fees: string;
  timelines: string;
  interviewRequired: boolean;
  importantNotes: string[];
}

export interface VisaAgentData {
  id: string;
  citizenshipCountry: string;
  destinationCountry: string;
  visaType: string;
  documents: string[];
  processSteps: string[];
  fees: string;
  timelines: string;
  interview: boolean;
  postGraduation: string[];
  sourceUrl: string;
  disclaimer: string;
  notes: string[];
  fetchedAt: string;
  lastUpdated: string;
  alertSent: boolean;
  changeSummary: {
    isNew: boolean;
    alertNeeded: boolean;
    changes: VisaChangeData[];
    hasChanges?: boolean;
  };
  checklist?: VisaChecklistData;
}

interface VisaAgentCardProps {
  visa: VisaAgentData;
}

const VisaAgentCard: React.FC<VisaAgentCardProps> = ({ visa }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-5 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-3 md:gap-4 lg:gap-5">
        {/* Left Column - Main Info */}
        <div className="space-y-3">
          {/* Title and Route */}
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg md:text-xl font-bold text-primary-darkest">
                {visa.visaType}
              </h3>
              {visa.changeSummary.isNew && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">
                  New
                </span>
              )}
            </div>
            <p className="text-neutral-gray text-sm">
              {visa.citizenshipCountry} → {visa.destinationCountry}
            </p>
          </div>

          {/* Tags/Badges */}
          <div className="flex flex-wrap gap-1.5">
            {visa.interview && (
              <span
                className="px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700"
                style={{ borderRadius: '6px', border: '1px solid #FEF3C7' }}
              >
                Interview Required
              </span>
            )}
            {visa.changeSummary.alertNeeded && (
              <span
                className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700"
                style={{ borderRadius: '6px', border: '1px solid #FEE2E2' }}
              >
                Policy Updated
              </span>
            )}
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-neutral-gray" />
              <span className="text-sm text-primary-darkest">{visa.fees}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-neutral-gray" />
              <span className="text-sm text-primary-darkest">{visa.timelines}</span>
            </div>

            <div className="flex items-center gap-2">
              {visa.interview ? (
                <AlertCircle size={16} className="text-yellow-500" />
              ) : (
                <CheckCircle size={16} className="text-green-500" />
              )}
              <span className="text-sm text-primary-darkest">
                {visa.interview ? 'Interview required' : 'No interview'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-neutral-gray" />
              <span className="text-sm text-primary-darkest truncate" title={visa.postGraduation.join(', ')}>
                {visa.postGraduation[0] || 'Not specified'}
              </span>
            </div>
          </div>

          {/* Documents Required - Show checklist if available, otherwise show basic list */}
          <div>
            <p className="text-sm font-bold text-primary-darkest mb-1.5 flex items-center gap-1.5">
              <FileText size={14} />
              Required Documents:
            </p>
            {visa.checklist?.documents && visa.checklist.documents.length > 0 ? (
              <ul className="space-y-1.5">
                {visa.checklist.documents.slice(0, 5).map((doc, index) => (
                  <li key={index} className="text-sm text-neutral-gray flex items-start gap-1.5">
                    {doc.required ? (
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span>
                      {doc.item}
                      {doc.notes && <span className="text-xs text-gray-400 ml-1">({doc.notes})</span>}
                    </span>
                  </li>
                ))}
                {visa.checklist.documents.length > 5 && (
                  <li className="text-xs text-gray-500">
                    +{visa.checklist.documents.length - 5} more documents
                  </li>
                )}
              </ul>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {visa.documents.slice(0, 5).map((doc, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-white text-gray-700"
                    style={{ borderRadius: '6px', border: '1px solid #E5E5E5' }}
                  >
                    {doc}
                  </span>
                ))}
                {visa.documents.length > 5 && (
                  <span
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600"
                    style={{ borderRadius: '6px' }}
                  >
                    +{visa.documents.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Middle Column - Process Steps */}
        <div>
          <p className="text-sm font-bold text-primary-darkest mb-2 flex items-center gap-1.5">
            <ListChecks size={14} />
            Process Steps:
          </p>
          <ul className="space-y-1.5">
            {visa.processSteps.map((step, index) => (
              <li key={index} className="text-sm text-neutral-gray flex items-start gap-1.5">
                <span className="text-primary-dark mt-0.5 font-medium">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          {/* Important Notes from checklist */}
          {visa.checklist?.importantNotes && visa.checklist.importantNotes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-bold text-primary-darkest mb-1">Important Notes:</p>
              <ul className="space-y-1">
                {visa.checklist.importantNotes.map((note, index) => (
                  <li key={index} className="text-xs text-neutral-gray">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* General Notes if any */}
          {Array.isArray(visa.notes) && visa.notes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-bold text-primary-darkest mb-1">Notes:</p>
              <ul className="space-y-1">
                {visa.notes.map((note, index) => (
                  <li key={index} className="text-xs text-neutral-gray">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Status and Actions */}
        <div className="flex flex-col">
          {/* Last Updated */}
          <div className="text-center lg:text-center mb-4">
            <p className="text-xs text-neutral-gray mb-1">Last Updated</p>
            <p className="text-sm font-medium text-primary-darkest">
              {new Date(visa.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Changes if any */}
          {Array.isArray(visa.changeSummary.changes) && visa.changeSummary.changes.length > 0 && (
            <div className="mb-4 p-2 bg-yellow-50 rounded-lg">
              <p className="text-xs font-medium text-yellow-700 mb-1">Recent Changes:</p>
              {visa.changeSummary.changes.map((change, index) => (
                <p key={index} className="text-xs text-yellow-600">
                  • {change.field} {change.changeType}
                </p>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-1.5 mt-auto">
            <a
              href={visa.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-darkest text-white font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ExternalLink size={14} />
              View Official Info
            </a>
          </div>

          {/* Disclaimer */}
          {visa.disclaimer && (
            <p className="text-xs text-neutral-gray mt-3 italic">
              {visa.disclaimer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaAgentCard;
