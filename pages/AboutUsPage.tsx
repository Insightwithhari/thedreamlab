import React from 'react';

const ProfileCard: React.FC<{ name: string; title: string; imageUrl: string; bio: string; quote: string }> = ({ name, title, imageUrl, bio, quote }) => (
  <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-cyan-500/20 shadow-lg">
    <img src={imageUrl} alt={`Profile of ${name}`} className="w-32 h-32 rounded-full mb-4 border-4 border-gray-700 object-cover" />
    <h3 className="text-xl font-bold text-white">{name}</h3>
    <p className="text-cyan-400">{title}</p>
    <p className="text-gray-400 mt-2 text-sm italic">"{quote}"</p>
    <p className="text-gray-300 mt-4 text-sm">{bio}</p>
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

        {/* Supervisors Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-center mb-8 border-b-2 border-cyan-500 pb-2">Supervisors</h2>
          <p className="text-center text-gray-400 mb-8">
            These exceptional individuals are not just our supervisors; they are our **mentors and teachers**, guiding our research and fostering a culture of innovation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileCard 
              name="Dr. Evelyn Reed" 
              title="Principal Investigator" 
              imageUrl="https://i.pravatar.cc/150?img=1" 
              bio="Dr. Reed's research focuses on computational methods for drug discovery, with a special interest in novel protein structures."
              quote="Innovation thrives at the intersection of biology and computation."
            />
            <ProfileCard 
              name="Dr. Marcus Chen" 
              title="Senior Research Scientist" 
              imageUrl="https://i.pravatar.cc/150?img=2" 
              bio="With a background in machine learning, Dr. Chen specializes in developing algorithms for protein folding and design."
              quote="Every line of code is a step towards a new discovery."
            />
          </div>
        </div>
        
        {/* Developers Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-center mb-8 border-b-2 border-cyan-500 pb-2">Developers</h2>
          <p className="text-center text-lg text-gray-300">
            Our mission is to create innovative software and research tools that accelerate scientific discovery. We believe in open-source collaboration and in fostering the next generation of computational scientists.
          </p>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileCard 
              name="Hariom" 
              title="Owner" 
              imageUrl="https://i.pravatar.cc/150?img=3" 
              bio="Hariom is passionate about creating intuitive user interfaces for complex bioinformatics tools."
              quote="Making science accessible through great design is my goal."
            />
            <ProfileCard 
              name="Sofia Garcia" 
              title="Bioinformatics Engineer" 
              imageUrl="https://i.pravatar.cc/150?img=4" 
              bio="Sofia's work involves large-scale data analysis to identify genetic markers for disease."
              quote="The answers are in the data; we just need the right tools to find them."
            />
          </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">Thank You!</p>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;
