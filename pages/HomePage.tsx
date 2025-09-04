import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8 text-white">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-cyan-300">
          Welcome to The Dream Lab
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          - where we explore the questions we want the answers for.
        </p>
        <p className="mt-8 max-w-2xl mx-auto text-gray-400">
          Our platform integrates cutting-edge AI with powerful bioinformatics tools. 
          Navigate using the menu to chat with our research assistant Dr. Rhesus, view project dashboards, or learn more about our team.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
