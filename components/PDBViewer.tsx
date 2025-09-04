import React, { useEffect, useRef, useState } from 'react';

declare const $3Dmol: any;

interface PDBViewerProps {
  pdbId: string;
  style?: 'cartoon' | 'surface' | 'interaction';
  interaction?: { chain1: string, chain2: string };
}

const PDBViewer: React.FC<PDBViewerProps> = ({ pdbId, style = 'cartoon', interaction }) => {
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

          if (style === 'surface') {
            viewer.setStyle({}, { cartoon: { colorscheme: 'chain' } });
            viewer.addSurface($3Dmol.SurfaceType.MS, {
              opacity: 0.9,
              colorscheme: 'electrostatic',
            });
            viewer.zoomTo();
          } else if (style === 'interaction' && interaction) {
            const { chain1, chain2 } = interaction;
            
            // Set a faint cartoon style for the entire protein as a baseline context.
            viewer.setStyle({}, { cartoon: { color: 'lightgray', opacity: 0.2 } });

            // Define selections for the interacting residues (within 4.5 angstroms).
            const interSel1 = { chain: chain1, within: { distance: 4.5, sel: { chain: chain2 } } };
            const interSel2 = { chain: chain2, within: { distance: 4.5, sel: { chain: chain1 } } };

            // Override the style for the interacting residues, making them prominent.
            viewer.setStyle(interSel1, { stick: { colorscheme: 'cyanCarbon', radius: 0.15 } });
            viewer.setStyle(interSel2, { stick: { colorscheme: 'magentaCarbon', radius: 0.15 } });
            
            // Add labels with a background for better readability.
            const labelStyle = {
                fontColor: 'white',
                fontSize: 12,
                backgroundColor: 'rgba(31, 41, 55, 0.7)', // gray-800 with opacity
                borderColor: 'transparent',
            };
            viewer.addResLabels({ and: [interSel1, { elem: 'CA' }] }, (atom: any) => `${atom.resn}${atom.resi}`, labelStyle);
            viewer.addResLabels({ and: [interSel2, { elem: 'CA' }] }, (atom: any) => `${atom.resn}${atom.resi}`, labelStyle);
            
            // Visualize hydrogen bonds between the interacting residues.
            viewer.addHBonds({ sel1: interSel1, sel2: interSel2 }, { color: 'white', dashed: true });
            
            // Center the view on the interaction site.
            viewer.zoomTo({ or: [interSel1, interSel2] });

          } else { // default 'cartoon' style
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            viewer.zoomTo();
          }

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
  }, [pdbId, style, interaction]);

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-black min-h-[400px] w-full max-w-2xl relative">
      {isLoading && <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">Loading 3D View...</div>}
      {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">{error}</div>}
      <div ref={viewerRef} style={{ width: '100%', height: '400px', position: 'relative' }} />
    </div>
  );
};

export default PDBViewer;
