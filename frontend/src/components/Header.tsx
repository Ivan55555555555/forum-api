import React from 'react';

interface HeaderProps {
  title: string;
  description: string;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { title, description } = props;

  return (
    <header className="forum-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
};
