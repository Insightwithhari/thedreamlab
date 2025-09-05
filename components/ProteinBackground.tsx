import React, { useEffect, useRef } from 'react';

declare const $3Dmol: any;

const ProteinBackground: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pdbId = '1XQ8'; // Alpha-synuclein

  useEffect(() => {
    let viewer: any = null;
    let rotationInterval: number | undefined;

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
          
          // Optimized rotation: instead of a constant high-framerate spin,
          // we rotate by a small amount on a set interval. This is much
          // more performant and prevents the UI from hanging.
          rotationInterval = window.setInterval(() => {
            if (viewer) {
              viewer.rotate(1, { y: 1 }); // Rotate 1 degree around the Y axis
              viewer.render(); // Re-render the scene after rotation
            }
          }, 100); // Rotate every 100ms
        })
        .catch((err) => {
          console.error("Background PDB fetch error:", err);
        });
    }

    return () => {
      // Cleanup: clear interval and viewer on component unmount
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
      if (viewer && viewer.clear) {
        viewer.clear();
      }
    };
  }, []);

  return (
    <div 
      ref={viewerRef} 
      className="absolute inset-0 z-0 opacity-40"
      style={{ width: '100%', height: '100%' }} 
    />
  );
};

export default ProteinBackground;