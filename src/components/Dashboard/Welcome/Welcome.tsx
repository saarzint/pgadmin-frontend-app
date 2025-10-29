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
      <div className="bg-gradient-to-r from-gradient-blue to-gradient-cyan p-6 md:p-8 h-full flex flex-col justify-center">
        {/* Welcome Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-3 max-w-md">
          Welcome back, {userName}!
        </h1>

        {/* Message Text - Combined */}
        <p className="text-sm md:text-base text-primary-darkest mb-6 max-w-sm">
          {message} You have <span className="font-semibold">{upcomingDeadlines} upcoming deadlines</span> this week.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={onCompleteProfile}
          className="bg-primary-dark hover:bg-primary-darkest text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg self-start"
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
