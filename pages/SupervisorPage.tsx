import React from 'react';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-cyan-400 mb-3">{title}</h3>
        <div className="text-gray-300">{children}</div>
    </div>
);

const SupervisorPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-cyan-300">Supervisor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard title="Ongoing Projects">
                <p>Tracking 3 active research projects. Next milestone for Project Chimera is due next Friday.</p>
            </InfoCard>
            <InfoCard title="Recent Publications">
                <p>A new paper on "In-Silico Protein Folding" has been accepted by the Journal of Molecular Biology.</p>
            </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default SupervisorPage;