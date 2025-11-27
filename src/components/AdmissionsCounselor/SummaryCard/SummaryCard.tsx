import React from 'react';
import { TrendingUp, Target, Lightbulb, Settings } from 'lucide-react';

interface SummaryCardProps {
  currentStage: string;
  progressScore: number;
  advice: string;
  onEditStage?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  currentStage,
  progressScore,
  advice,
  onEditStage,
}) => {
  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    if (score >= 25) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-dark" />
          <h2 className="text-lg font-bold text-primary-darkest">Progress Summary</h2>
        </div>
        {onEditStage && (
          <button
            onClick={onEditStage}
            className="p-1.5 text-gray-500 hover:text-primary-dark hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Stage"
          >
            <Settings size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Current Stage */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-lightest rounded-lg">
            <Target size={18} className="text-primary-dark" />
          </div>
          <div>
            <p className="text-xs text-neutral-gray">Current Stage</p>
            <p className="text-sm font-semibold text-primary-darkest">{currentStage}</p>
          </div>
        </div>

        {/* Progress Score */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-neutral-gray">Overall Progress</p>
            <p className="text-sm font-bold text-primary-darkest">{progressScore.toFixed(1)}%</p>
          </div>
          <div className={`w-full h-2.5 rounded-full ${getProgressBgColor(progressScore)}`}>
            <div
              className={`h-full rounded-full ${getProgressColor(progressScore)} transition-all duration-500`}
              style={{ width: `${Math.min(progressScore, 100)}%` }}
            />
          </div>
        </div>

        {/* AI Advice */}
        {advice && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-700 mb-1">AI Recommendation</p>
                <p className="text-sm text-blue-800">{advice}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
