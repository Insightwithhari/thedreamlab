import React from 'react';

const ProfileCard: React.FC<{ name: string; title: string; imageUrl: string }> = ({ name, title, imageUrl }) => (
  <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-cyan-500/20 shadow-lg">
    <img src={imageUrl} alt={`Profile of ${name}`} className="w-32 h-32 rounded-full mb-4 border-4 border-gray-700 object-cover" />
    <h3 className="text-xl font-bold text-white">{name}</h3>
    <p className="text-cyan-400">{title}</p>
  </div>
);

const AboutUsPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-cyan-300">About The Dream Lab</h1>
        <p className="text-lg text-center text-gray-300 mb-12">
          We are a dedicated team of researchers and developers passionate about leveraging computational tools to push the boundaries of bioinformatics and protein engineering.
        </p>
        
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-center mb-8 border-b-2 border-cyan-500 pb-2">Supervisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileCard name="Dr. Evelyn Reed" title="Principal Investigator" imageUrl="https://i.pravatar.cc/150?img=1" />
            <ProfileCard name="Dr. Marcus Chen" title="Senior Research Scientist" imageUrl="https://i.pravatar.cc/150?img=2" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-semibold text-center mb-8 border-b-2 border-cyan-500 pb-2">Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileCard name="Jian Li" title="Ph.D. Candidate" imageUrl="https://i.pravatar.cc/150?img=3" />
            <ProfileCard name="Sofia Garcia" title="Bioinformatics Engineer" imageUrl="https://i.pravatar.cc/150?img=4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
