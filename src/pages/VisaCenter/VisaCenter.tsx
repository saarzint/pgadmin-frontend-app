import { useState } from 'react';
import { CheckCircle, Circle, Calendar, FileText, MessageSquare, Clock } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
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
  // Country Visa Checklist
  const [countryVisas, setCountryVisas] = useState<ChecklistItem[]>([
    { id: '1', label: 'United States (F-1 Student Visa)', completed: false },
    { id: '2', label: 'United Kingdom (Tier 4 Student Visa)', completed: false },
    { id: '3', label: 'Canada (Study Permit)', completed: false },
    { id: '4', label: 'Australia (Student Visa Subclass 500)', completed: false },
    { id: '5', label: 'Germany (Student Visa)', completed: false },
    { id: '6', label: 'France (Long-stay Student Visa)', completed: false },
  ]);

  // Important Documents Checklist
  const [documents, setDocuments] = useState<ChecklistItem[]>([
    { id: '1', label: 'Valid Passport (minimum 6 months validity)', completed: false },
    { id: '2', label: 'University Acceptance Letter (I-20/Offer Letter)', completed: false },
    { id: '3', label: 'Visa Application Form (DS-160/equivalent)', completed: false },
    { id: '4', label: 'Passport-sized Photographs', completed: false },
    { id: '5', label: 'Financial Documents (Bank Statements)', completed: false },
    { id: '6', label: 'Proof of English Proficiency (TOEFL/IELTS)', completed: false },
    { id: '7', label: 'Academic Transcripts and Certificates', completed: false },
    { id: '8', label: 'SEVIS Fee Receipt (for US)', completed: false },
    { id: '9', label: 'Visa Application Fee Receipt', completed: false },
    { id: '10', label: 'Travel Insurance', completed: false },
  ]);

  // Interview Process Checklist
  const [interviewSteps, setInterviewSteps] = useState<ChecklistItem[]>([
    { id: '1', label: 'Schedule visa interview appointment', completed: false },
    { id: '2', label: 'Prepare all required documents', completed: false },
    { id: '3', label: 'Practice common interview questions', completed: false },
    { id: '4', label: 'Research your university and program', completed: false },
    { id: '5', label: 'Prepare financial evidence explanation', completed: false },
    { id: '6', label: 'Plan your travel to embassy/consulate', completed: false },
    { id: '7', label: 'Dress professionally for interview', completed: false },
    { id: '8', label: 'Arrive 15 minutes early', completed: false },
    { id: '9', label: 'Follow up on visa status', completed: false },
  ]);

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

  const toggleChecklistItem = (
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    id: string
  ) => {
    setList(list.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

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

  const ChecklistSection = ({
    title,
    icon: Icon,
    items,
    setItems,
  }: {
    title: string;
    icon: React.ElementType;
    items: ChecklistItem[];
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  }) => {
    const completedCount = items.filter((item) => item.completed).length;
    const totalCount = items.length;
    const progressPercentage = (completedCount / totalCount) * 100;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-light rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleChecklistItem(items, setItems, item.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              {item.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <span
                className={`flex-1 ${
                  item.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
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

        {/* Checklist Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChecklistSection
            title="Country Visa Checklist"
            icon={Calendar}
            items={countryVisas}
            setItems={setCountryVisas}
          />
          <ChecklistSection
            title="Important Documents"
            icon={FileText}
            items={documents}
            setItems={setDocuments}
          />
        </div>

        <div className="mb-6">
          <ChecklistSection
            title="Interview Process"
            icon={MessageSquare}
            items={interviewSteps}
            setItems={setInterviewSteps}
          />
        </div>

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
