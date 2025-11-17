import React, { useState } from 'react';
import { ResourceCard, CurrencyConverter } from '../../components/AdditionalResources';
import {
  FileText,
  GraduationCap,
  BookOpen
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
      url: 'https://rushtranslate.com?ref=pgadmit',
    },
    {
      id: '2',
      title: 'Student Loans',
      icon: GraduationCap,
      url: 'https://app.mpowerfinancing.com/eligibility?utm_source=pgadmit&utm_medium=link',
    },
    {
      id: '3',
      title: 'Test Prep (English & Standardized Tests)',
      icon: BookOpen,
      url: 'https://imp.i384100.net/2aAenQ',
    },
  ]);

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
      </div>
    </div>
  );
};

export default AdditionalResources;
