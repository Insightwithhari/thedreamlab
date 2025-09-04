
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
            
            // Set a default style for the whole protein (semi-transparent cartoon for context)
            viewer.setStyle({}, { cartoon: { color: 'lightgray', opacity: 0.4 } });

            // Define selections for interacting residues (within 5 angstroms)
            const interSel1 = { chain: chain1, within: { distance: 5, sel: { chain: chain2 } } };
            const interSel2 = { chain: chain2, within: { distance: 5, sel: { chain: chain1 } } };
            
            // Define distinct colors for each chain
            const chain1Color = '#67e8f9'; // A nice cyan
            const chain2Color = '#f472b6'; // A nice pink
            
            // Apply distinct styles to interacting residues (stick + solid cartoon)
            viewer.setStyle(interSel1, { stick: { color: chain1Color }, cartoon: { color: chain1Color } });
            viewer.setStyle(interSel2, { stick: { color: chain2Color }, cartoon: { color: chain2Color } });
            
            // Add labels only to alpha carbons to prevent clutter, with a background for readability
            const labelStyle = {
                fontColor: 'white',
                fontSize: 10,
                backgroundColor: 'rgba(17, 24, 39, 0.7)', // gray-900 with opacity
                borderColor: 'transparent',
                padding: '2px',
            };
            viewer.addResLabels({and: [interSel1, {elem: 'CA'}]}, labelStyle);
            viewer.addResLabels({and: [interSel2, {elem: 'CA'}]}, labelStyle);
            
            // Add hydrogen bonds as white dashed lines
            viewer.addHBonds({ sel1: { chain: chain1 }, sel2: { chain: chain2 } }, { color: 'white', dashed: true, lineWidth: 0.8 });
            
            // Zoom to the interaction site
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
