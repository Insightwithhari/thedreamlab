
import React, { useEffect, useRef, useState } from 'react';

declare const $3Dmol: any;

interface PDBViewerProps {
  pdbId: string;
}

const PDBViewer: React.FC<PDBViewerProps> = ({ pdbId }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let viewer: any = null;
    if (viewerRef.current && pdbId) {
      setIsLoading(true);
      setError(null);
      const element = viewerRef.current;
      const config = { backgroundColor: 'black' };
      viewer = $3Dmol.createViewer(element, config);

      fetch(`https://files.rcsb.org/view/${pdbId}.pdb`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch PDB data for ${pdbId}. Status: ${res.status}`);
          }
          return res.text();
        })
        .then((pdbData) => {
          viewer.addModel(pdbData, 'pdb');
          viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          viewer.zoomTo();
          viewer.render();
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("PDB fetch error:", err);
          setError(`Could not load PDB structure for ID: ${pdbId}. Please ensure it's a valid ID.`);
          setIsLoading(false);
        });
    }

    return () => {
      // Cleanup viewer on component unmount
      if (viewer && viewer.clear) {
        viewer.clear();
      }
    };
  }, [pdbId]);

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-black min-h-[400px] w-full max-w-2xl relative">
      {isLoading && <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">Loading 3D View...</div>}
      {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">{error}</div>}
      <div ref={viewerRef} style={{ width: '100%', height: '400px', position: 'relative' }} />
    </div>
  );
};

export default PDBViewer;
