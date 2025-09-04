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
  const [interactionList, setInteractionList] = useState<string[]>([]);

  useEffect(() => {
    let viewer: any = null;
    if (viewerRef.current && pdbId) {
      setIsLoading(true);
      setError(null);
      setInteractionList([]);
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
          } else if (style === 'interaction' && interaction) {
            // Ensure chain IDs are uppercase as they are case-sensitive. This makes the component more robust.
            const chain1 = interaction.chain1.toUpperCase();
            const chain2 = interaction.chain2.toUpperCase();
            
            const model = viewer.getModel();

            viewer.setStyle({}, { cartoon: { color: 'lightgray', opacity: 0.2 } });

            const interSel1 = { chain: chain1, within: { distance: 4.5, sel: { chain: chain2 } } };
            const interSel2 = { chain: chain2, within: { distance: 4.5, sel: { chain: chain1 } } };
            
            const interactingAtoms1 = model.selectedAtoms(interSel1);
            const interactingAtoms2 = model.selectedAtoms(interSel2);

            if (interactingAtoms1.length > 0 && interactingAtoms2.length > 0) {
              viewer.setStyle(interSel1, { stick: { colorscheme: 'cyanCarbon', radius: 0.15 } });
              viewer.setStyle(interSel2, { stick: { colorscheme: 'magentaCarbon', radius: 0.15 } });
              
              const labelStyle = { fontColor: 'white', fontSize: 12, backgroundColor: 'rgba(31, 41, 55, 0.7)', borderColor: 'transparent' };
              viewer.addResLabels({ and: [interSel1, { elem: 'CA' }] }, (atom: any) => `${atom.resn}${atom.resi}`, labelStyle);
              viewer.addResLabels({ and: [interSel2, { elem: 'CA' }] }, (atom: any) => `${atom.resn}${atom.resi}`, labelStyle);
              
              viewer.zoomTo({ or: [interSel1, interSel2] });

              // Extract and set interaction list
              const residues1 = new Set<string>();
              interactingAtoms1.forEach((atom: any) => residues1.add(`${atom.resn} ${atom.resi} (Chain ${atom.chain})`));
              
              const residues2 = new Set<string>();
              interactingAtoms2.forEach((atom: any) => residues2.add(`${atom.resn} ${atom.resi} (Chain ${atom.chain})`));

              const combinedList = [
                  `--- Chain ${chain1} Interacting Residues ---`,
                  ...Array.from(residues1).sort(),
                  `--- Chain ${chain2} Interacting Residues ---`,
                  ...Array.from(residues2).sort(),
              ]
              setInteractionList(combinedList);

            } else {
              // If no interactions found, just show the chains for context
              setInteractionList(['No significant interactions found within 4.5Å. Displaying chains for context.']);
              viewer.setStyle({chain: chain1}, {cartoon: {color: 'cyan'}});
              viewer.setStyle({chain: chain2}, {cartoon: {color: 'magenta'}});
              viewer.zoomTo({or: [{chain: chain1}, {chain: chain2}]});
            }

          } else { // default 'cartoon' style
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          }

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
      if (viewer && viewer.clear) {
        viewer.clear();
      }
    };
  }, [pdbId, style, interaction]);

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-black w-full max-w-2xl flex flex-col">
        <div className="min-h-[400px] w-full relative">
            {isLoading && <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">Loading 3D View...</div>}
            {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">{error}</div>}
            <div ref={viewerRef} style={{ width: '100%', height: '400px', position: 'relative' }} />
        </div>
        {style === 'interaction' && interactionList.length > 0 && (
            <div className="bg-gray-800 p-3 border-t border-gray-700 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-bold text-gray-300 mb-2">Interaction Analysis (Residues within 4.5Å)</h4>
                <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                    {interactionList.join('\n')}
                </pre>
            </div>
        )}
    </div>
  );
};

export default PDBViewer;
