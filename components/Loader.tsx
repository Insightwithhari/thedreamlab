
import type React from 'react';
import { RhesusIcon } from './icons';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <RhesusIcon className="w-8 h-8 text-cyan-400 animate-pulse" />
      <p className="mt-2 text-sm text-gray-400">Dr. Rhesus is thinking...</p>
    </div>
  );
};

export default Loader;
