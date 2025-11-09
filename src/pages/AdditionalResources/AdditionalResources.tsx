import React, { useState } from 'react';
import { ResourceCard, CurrencyConverter } from '../../components/AdditionalResources';
import {
  FileText,
  GraduationCap,
  Home,
  Shield,
  BookOpen,
  Upload,
  Plus,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  icon: any;
  url: string;
}

const AdditionalResources: React.FC = () => {
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Document Translation',
      icon: FileText,
      url: 'https://translate.google.com',
    },
    {
      id: '2',
      title: 'Student Loans',
      icon: GraduationCap,
      url: '#',
    },
    {
      id: '3',
      title: 'Student Housing',
      icon: Home,
      url: '#',
    },
    {
      id: '4',
      title: 'Travel Insurance',
      icon: Shield,
      url: '#',
    },
    {
      id: '5',
      title: 'Test Prep Services',
      icon: BookOpen,
      url: '#',
    },
  ]);

  const handleUploadDocument = () => {
    console.log('Upload document clicked');
    // Implement document upload functionality
  };

  const handleAddNew = () => {
    console.log('Add new resource clicked');
    // Implement add new resource functionality
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="w-full px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-darkest">Additional Resources</h1>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              icon={resource.icon}
              url={resource.url}
            />
          ))}

          {/* Currency Converter Card */}
          <CurrencyConverter />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleUploadDocument}
            className="flex items-center gap-2 px-8 py-3 bg-primary-darkest text-white rounded-lg hover:bg-primary-dark transition-colors text-base font-semibold shadow-sm"
          >
            <Upload size={20} />
            Upload Document
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-8 py-3 bg-primary-lightest text-primary-darkest rounded-lg hover:bg-primary-light transition-colors text-base font-semibold"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalResources;
