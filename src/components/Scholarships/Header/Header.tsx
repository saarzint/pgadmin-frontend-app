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
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-primary-darkest mb-1">
        {title}
      </h1>
      <p className="text-neutral-gray text-sm md:text-base">{subtitle}</p>
    </div>
  );
};

export default Header;
