import React, { useEffect, useRef, useState } from 'react';

declare const $3Dmol: any;

interface PDBViewerProps {
  pdbId: string;
  style?: 'cartoon' | 'surface' | 'interaction' | 'query_residue' | 'pocket';
  interaction?: { chain1: string, chain2: string };
  query?: { chain: string, resi: string };
}

// Helper sets for residue classification
const POSITIVE_RES = ['ARG', 'LYS', 'HIS'];
const NEGATIVE_RES = ['ASP', 'GLU'];
const POLAR_RES = ['SER', 'THR', 'CYS', 'ASN', 'GLN', 'TYR'];
const HYDROPHOBIC_RES = ['ALA', 'VAL', 'ILE', 'LEU', 'MET', 'PHE', 'TRP', 'PRO', 'GLY'];

const PDBViewer: React.FC<PDBViewerProps> = ({ pdbId, style = 'cartoon', interaction, query }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisText, setAnalysisText] = useState<string>('');

  useEffect(() => {
    let viewer: any = null;
    if (viewerRef.current && pdbId) {
      setIsLoading(true);
      setError(null);
      setAnalysisText('');
      const element = viewerRef.current;
      const config = { backgroundColor: 'black' };
      viewer = $3Dmol.createViewer(element, config);

      fetch(`https://files.rcsb.org/view/${pdbId}.pdb`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch PDB data for ${pdbId}. Status: ${res.status}`);
          return res.text();
        })
        .then((pdbData) => {
          viewer.addModel(pdbData, 'pdb');
          const model = viewer.getModel();

          if (style === 'surface') {
            viewer.setStyle({}, { cartoon: { colorscheme: 'chain' } });
            viewer.addSurface($3Dmol.SurfaceType.MS, { opacity: 0.9, colorscheme: 'electrostatic' });
          } else if (style === 'pocket') {
            viewer.setStyle({}, { cartoon: { colorscheme: 'chain' } });
            viewer.addSurface($3Dmol.SurfaceType.MS, { opacity: 0.85, color: 'white' });
            viewer.addSurface($3Dmol.SurfaceType.SAS, { map: { prop: 'hydrophobicity', LtoH: ['blue', 'white', 'red'] } });
            setAnalysisText('Displaying potential binding pockets. Red regions are hydrophobic, blue are hydrophilic.');
          } else if (style === 'interaction' && interaction) {
            // --- Inter-Chain Interaction Logic ---
            const { chain1, chain2 } = interaction;
            const atoms = model.selectedAtoms({});
            let analysis = [`Interaction Analysis for ${pdbId} between Chain ${chain1} and ${chain2}:\n`];
            
            viewer.setStyle({}, { cartoon: { color: 'lightgray', opacity: 0.5 } });
            
            const sel1 = { chain: chain1 };
            const sel2 = { chain: chain2 };

            // Find H-Bonds
            const hbonds = model.getHBonds();
            let hbondResidues = new Set();
            for (let i = 0; i < hbonds.length; i++) {
                const bond = hbonds[i];
                const atom1 = atoms[bond[0]];
                const atom2 = atoms[bond[1]];
                if ((atom1.chain === chain1 && atom2.chain === chain2) || (atom1.chain === chain2 && atom2.chain === chain1)) {
                    analysis.push(`- H-Bond: ${atom1.resn}${atom1.resi} (Chain ${atom1.chain}) <--> ${atom2.resn}${atom2.resi} (Chain ${atom2.chain})`);
                    hbondResidues.add(`${atom1.chain}:${atom1.resi}`);
                    hbondResidues.add(`${atom2.chain}:${atom2.resi}`);
                }
            }
            if (hbondResidues.size > 0) viewer.addHBonds(sel1, sel2, { color: 'white', dashed: true });

            // Find Salt Bridges (charged residues within 5Å)
            let saltBridgeResidues = new Set();
            const chargedAtoms1 = model.selectedAtoms({ ...sel1, resn: [...POSITIVE_RES, ...NEGATIVE_RES] });
            const chargedAtoms2 = model.selectedAtoms({ ...sel2, resn: [...POSITIVE_RES, ...NEGATIVE_RES] });
            for (const a1 of chargedAtoms1) {
                for (const a2 of chargedAtoms2) {
                    const isPositive1 = POSITIVE_RES.includes(a1.resn);
                    const isNegative2 = NEGATIVE_RES.includes(a2.resn);
                    const isNegative1 = NEGATIVE_RES.includes(a1.resn);
                    const isPositive2 = POSITIVE_RES.includes(a2.resn);

                    if ((isPositive1 && isNegative2) || (isNegative1 && isPositive2)) {
                        const dist = Math.sqrt(Math.pow(a1.x - a2.x, 2) + Math.pow(a1.y - a2.y, 2) + Math.pow(a1.z - a2.z, 2));
                        if (dist < 5.0) {
                            analysis.push(`- Salt Bridge (potential): ${a1.resn}${a1.resi} (Chain ${a1.chain}) <--> ${a2.resn}${a2.resi} (Chain ${a2.chain}) @ ${dist.toFixed(2)}Å`);
                            saltBridgeResidues.add(`${a1.chain}:${a1.resi}`);
                            saltBridgeResidues.add(`${a2.chain}:${a2.resi}`);
                        }
                    }
                }
            }

            // Find general contacts (within 4.5Å)
            const contactSel1 = { chain: chain1, within: { distance: 4.5, sel: { chain: chain2 } } };
            const contactSel2 = { chain: chain2, within: { distance: 4.5, sel: { chain: chain1 } } };
            const contactAtoms1 = model.selectedAtoms(contactSel1);
            if(contactAtoms1.length > 0) analysis.push(`\nOther contacts (within 4.5Å):`);
            const contactResidues = new Set();
            for (const atom of contactAtoms1) { contactResidues.add(`${atom.resn}${atom.resi} (Chain ${atom.chain})`); }
            contactResidues.forEach(res => analysis.push(`- ${res}`));
            
            // Visualize all interacting residues
            const allInteractingResidues = new Set([...hbondResidues, ...saltBridgeResidues, ...Array.from(contactAtoms1).map(a => `${a.chain}:${a.resi}`)]);
            if (allInteractingResidues.size > 0) {
              const resiList1 = Array.from(allInteractingResidues).filter(r => r.startsWith(chain1)).map(r => parseInt(r.split(':')[1]));
              const resiList2 = Array.from(allInteractingResidues).filter(r => r.startsWith(chain2)).map(r => parseInt(r.split(':')[1]));
              
              viewer.setStyle({chain: chain1, resi: resiList1}, {stick: {colorscheme: 'cyanCarbon', radius: 0.15}});
              viewer.setStyle({chain: chain2, resi: resiList2}, {stick: {colorscheme: 'magentaCarbon', radius: 0.15}});
              viewer.zoomTo({or: [{chain: chain1, resi: resiList1}, {chain: chain2, resi: resiList2}]});
            } else {
              analysis = ["No significant interactions found. Displaying chains for context."];
              viewer.setStyle({chain: chain1}, {cartoon: {color: 'cyan'}});
              viewer.setStyle({chain: chain2}, {cartoon: {color: 'magenta'}});
              viewer.zoomTo();
            }
            setAnalysisText(analysis.join('\n'));
          } else if (style === 'query_residue' && query) {
            // --- Single Residue Query Logic ---
            const { chain, resi } = query;
            const resiNum = parseInt(resi);
            
            viewer.setStyle({}, { cartoon: { color: 'lightgray', opacity: 0.5 } });

            const querySel = { chain, resi: resiNum };
            const queryRes = model.selectedAtoms(querySel)[0];

            if (!queryRes) {
                setError(`Residue ${resi} in chain ${chain} not found.`);
                setIsLoading(false);
                return;
            }

            viewer.setStyle(querySel, { stick: { colorscheme: 'greenCarbon', radius: 0.2 } });
            viewer.addResLabels(querySel, (atom: any) => `${atom.resn}${atom.resi}`, { fontColor: 'white', backgroundColor: 'green', backgroundOpacity: 0.5 });
            
            // Find interacting residues within 5 angstroms
            const neighborSel = { within: { distance: 5, sel: querySel }, not: querySel };
            const neighborAtoms = model.selectedAtoms(neighborSel);

            let analysis = [`Analysis for ${queryRes.resn}${queryRes.resi} (Chain ${chain}):\n`];
            const interactingResidues = new Map<string, { type: string, dist: number }>();

            for (const atom of neighborAtoms) {
                const dist = Math.sqrt(Math.pow(queryRes.x - atom.x, 2) + Math.pow(queryRes.y - atom.y, 2) + Math.pow(queryRes.z - atom.z, 2));
                const resKey = `${atom.resn}${atom.resi} (Chain ${atom.chain})`;
                
                // Simple classification
                let type = "Contact";
                if ((POSITIVE_RES.includes(queryRes.resn) && NEGATIVE_RES.includes(atom.resn)) || (NEGATIVE_RES.includes(queryRes.resn) && POSITIVE_RES.includes(atom.resn))) {
                    type = "Salt Bridge (potential)";
                } else if (POLAR_RES.includes(queryRes.resn) && POLAR_RES.includes(atom.resn)) {
                    type = "Polar Contact";
                }
                 // H-bond check could be added here if needed, but it's more complex

                if (!interactingResidues.has(resKey) || dist < interactingResidues.get(resKey)!.dist) {
                    interactingResidues.set(resKey, { type, dist });
                }
            }

            if (interactingResidues.size > 0) {
                viewer.setStyle(neighborSel, { stick: { colorscheme: 'cyanCarbon', radius: 0.15 } });
                viewer.addResLabels(neighborSel, (atom: any) => `${atom.resn}${atom.resi}`, { fontColor: 'white', backgroundColor: 'black', backgroundOpacity: 0.5 });
                interactingResidues.forEach((value, key) => {
                    analysis.push(`- ${value.type}: ${key} @ ~${value.dist.toFixed(2)}Å`);
                });
            } else {
                analysis.push("No residues found interacting within 5Å.");
            }
            
            setAnalysisText(analysis.join('\n'));
            viewer.zoomTo({ or: [querySel, neighborSel] });
          } else { // default 'cartoon' style
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          }

          viewer.render();
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("PDB processing error:", err);
          setError(`Could not load or process PDB structure for ID: ${pdbId}. Please ensure it's a valid ID.`);
          setIsLoading(false);
        });
    }

    return () => { if (viewer && viewer.clear) { viewer.clear(); } };
  }, [pdbId, style, interaction, query]);

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-black w-full max-w-2xl flex flex-col">
      <div className="min-h-[400px] w-full relative">
        {isLoading && <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">Loading 3D View...</div>}
        {error && <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">{error}</div>}
        <div ref={viewerRef} style={{ width: '100%', height: '400px', position: 'relative' }} />
      </div>
      {analysisText && (
        <div className="bg-gray-800 p-3 border-t border-gray-700 max-h-60 overflow-y-auto">
          <h4 className="text-sm font-bold text-gray-300 mb-2">Interaction Analysis</h4>
          <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
            {analysisText}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PDBViewer;
