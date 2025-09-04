import React from 'react';
import { FlaskIcon } from './icons';

interface PlasmidInfo {
  paperTitle: string;
  doi: string;
  authorName: string;
  authorEmail: string;
  location: string;
}

interface PlasmidInfoCardProps {
  info: PlasmidInfo;
}

const PlasmidInfoCard: React.FC<PlasmidInfoCardProps> = ({ info }) => {
  return (
    <div className="mt-4 p-4 border-l-4 border-cyan-500 bg-gray-800 rounded-r-md shadow-md">
      <div className="flex items-start space-x-3">
        <FlaskIcon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-lg text-cyan-300">Potential Plasmid Source Found</h3>
          <p className="text-sm text-gray-400 mt-1">Based on the publication below, the corresponding author may have the plasmid you're looking for.</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="font-semibold text-gray-200">Paper:</span> <a href={`https://doi.org/${info.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{info.paperTitle}</a></p>
            <p><span className="font-semibold text-gray-200">Corresponding Author:</span> {info.authorName}</p>
            <p><span className="font-semibold text-gray-200">Contact:</span> <a href={`mailto:${info.authorEmail}`} className="text-blue-400 hover:underline">{info.authorEmail}</a></p>
            <p><span className="font-semibold text-gray-200">Location:</span> {info.location}</p>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">Availability is not guaranteed. Please contact the author for details.</p>
        </div>
      </div>
    </div>
  );
};

export default PlasmidInfoCard;
