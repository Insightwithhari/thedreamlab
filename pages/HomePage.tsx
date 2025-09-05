import React from 'react';

const QuoteCard: React.FC = () => {
    const quote = "Your imagination is your best friend, when conscious world won't give you subconscious will. So, keep on moving in the journey which might seem endless and without any light, you have the capacity to figure this out";
    const author = "Dr Rimpy Kaur Chowhan";

    return (
        <div className="mt-12 mx-auto max-w-2xl bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 transition-transform transform hover:scale-105">
            <blockquote className="text-center">
                <p className="text-lg italic text-gray-200">
                    "{quote}"
                </p>
                <footer className="mt-6 text-md font-semibold text-cyan-400">
                    - {author}
                </footer>
            </blockquote>
        </div>
    );
};


const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8 text-white">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 animate-gradient-x">
          Welcome to The Dream Lab
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          - where we explore the questions we want the answers for.
        </p>
        <p className="mt-8 max-w-2xl mx-auto text-gray-400">
          Our platform integrates cutting-edge AI with powerful bioinformatics tools. 
          Navigate using the menu to chat with our research assistant Dr. Rhesus, view project dashboards, or learn more about our team.
        </p>
        <QuoteCard />
      </div>
    </div>
  );
};

export default HomePage;