import React from 'react';
import { ExternalLink, FileText, DollarSign, GraduationCap, Coins } from 'lucide-react';

const AdditionalResources: React.FC = () => {
  const resources = [
    {
      id: 'document-translation',
      title: 'Document Translation',
      description: 'Professional translation services for your academic documents',
      icon: FileText,
      url: 'https://rushtranslate.com?ref=pgadmit',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'student-loans',
      title: 'Student Loans',
      description: 'Check your eligibility for student financing options',
      icon: DollarSign,
      url: 'https://app.mpowerfinancing.com/eligibility?utm_source=pgadmit&utm_medium=link',
      color: 'bg-green-50 text-green-600',
    },
    {
      id: 'test-prep',
      title: 'Test Prep (English & Standardized Tests)',
      description: 'Prepare for TOEFL, IELTS, GRE, GMAT and other standardized tests',
      icon: GraduationCap,
      url: 'https://imp.i384100.net/2aAenQ',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-bold text-primary-darkest mb-4 px-8">
        Additional Resources
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 mb-6">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${resource.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-primary-darkest group-hover:text-primary-dark transition-colors">
                      {resource.title}
                    </h3>
                    <ExternalLink
                      size={16}
                      className="text-gray-400 group-hover:text-primary-dark transition-colors flex-shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="text-sm text-neutral-gray mt-1">
                    {resource.description}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Currency Converter Widget */}
      <div className="px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Coins size={20} />
            </div>
            <h3 className="text-base font-semibold text-primary-darkest">
              Currency Converter
            </h3>
          </div>
          <div className="flex justify-center">
            <iframe
              title="Currency Converter"
              src="https://wise.com/gb/currency-converter/fx-widget/converter?sourceCurrency=INR&targetCurrency=EUR"
              height="490"
              width="340"
              frameBorder="0"
              allowTransparency={true}
              className="border-0 rounded-lg"
            />
          </div>
          <p className="text-xs text-neutral-gray mt-3 text-center">
            Powered by Wise.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdditionalResources;
