import React from 'react';

interface WelcomeProps {
  userName?: string;
  message?: string;
  upcomingDeadlines?: number;
  onCompleteProfile?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({
  userName = 'Alex',
  message = 'Continue your journey to studying abroad.',
  upcomingDeadlines = 3,
  onCompleteProfile,
}) => {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
      {/* Gradient Background */}
      <div className="bg-gradient-to-r from-gradient-blue to-gradient-cyan p-4 md:p-6 h-full flex flex-col justify-center">
        {/* Welcome Header */}
        <h1 className="text-xl md:text-2xl font-bold text-primary-darkest mb-2 max-w-md">
          Welcome back, {userName}!
        </h1>

        {/* Message Text - Combined */}
        <p className="text-xs md:text-sm text-primary-darkest mb-4 max-w-sm">
          {message} You have <span className="font-semibold">{upcomingDeadlines} upcoming deadlines</span> this week.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={onCompleteProfile}
          className="bg-primary-dark hover:bg-primary-darkest text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg self-start text-sm"
        >
          Complete Profile Setup
        </button>
      </div>

      {/* Decorative Border Effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"></div>
    </div>
  );
};

export default Welcome;
