import React, { useEffect, useRef } from 'react';

declare const $3Dmol: any;

const ProteinBackground: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pdbId = '1XQ8'; // Alpha-synuclein

  useEffect(() => {
    let viewer: any = null;
    if (viewerRef.current) {
      const element = viewerRef.current;
      const config = { backgroundColor: '#0D1117' }; // Dark background matching theme
      viewer = $3Dmol.createViewer(element, config);

      fetch(`https://files.rcsb.org/view/${pdbId}.pdb`)
        .then((res) => res.text())
        .then((pdbData) => {
          viewer.addModel(pdbData, 'pdb');
          viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          viewer.zoomTo();
          viewer.render();
          viewer.spin(true); // Start spinning animation
        })
        .catch((err) => {
          console.error("Background PDB fetch error:", err);
        });
    }

    return () => {
      if (viewer && viewer.clear) {
        viewer.clear();
      }
    };
  }, []);

  return (
    <div 
      ref={viewerRef} 
      className="absolute inset-0 z-0 opacity-20"
      style={{ width: '100%', height: '100%' }} 
    />
  );
};

export default ProteinBackground;
