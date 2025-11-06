import React from 'react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  variant: 'blue' | 'green' | 'yellow';
}

interface RecommendationsProps {
  title?: string;
  recommendations?: Recommendation[];
  buttonText?: string;
  onButtonClick?: () => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  title = 'AI Recommendations',
  recommendations = [
    {
      id: '1',
      title: 'Complete your TOEFL preparation',
      description: 'Based on your target universities, aim for 110+ score',
      variant: 'blue',
    },
    {
      id: '2',
      title: 'Review your personal statement',
      description: 'AI detected areas for improvement in your Stanford essay',
      variant: 'green',
    },
    {
      id: '3',
      title: 'Explore backup options',
      description: 'Consider 2-3 safety schools matching your profile',
      variant: 'yellow',
    },
  ],
  buttonText = 'Get More AI Insights',
  onButtonClick,
}) => {
  const getVariantStyles = (variant: Recommendation['variant']) => {
    switch (variant) {
      case 'blue':
        return 'bg-primary-lightest border-primary-light';
      case 'green':
        return 'bg-[#A9FFEA66] border-[#A9FFEA]';
      case 'yellow':
        return 'bg-[#FFEFA966] border-[#FFEFA9]';
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-primary-darkest">{title}</h2>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3 mb-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`rounded-xl p-3 border ${getVariantStyles(recommendation.variant)}`}
          >
            <div className="flex items-start gap-2">
              {/* Bullet Point */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-error-main"></div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-primary-darkest mb-1">
                  {recommendation.title}
                </h3>
                <p className="text-xs text-primary-darkest leading-relaxed">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="py-2 px-4 border-2 border-primary-main text-primary-dark font-semibold rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Recommendations;
