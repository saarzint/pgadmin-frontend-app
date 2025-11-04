import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Scholarships & Financial',
  subtitle = 'Discover and manage scholarship opportunities with AI-powered matching',
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-darkest mb-2">
        {title}
      </h1>
      <p className="text-neutral-gray text-base md:text-lg">{subtitle}</p>
    </div>
  );
};

export default Header;
