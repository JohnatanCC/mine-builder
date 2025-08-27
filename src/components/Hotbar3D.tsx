import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { useWorld } from "@/state/world.store";
import { Block } from "@/components/Block";
import type { BlockType, BlockVariant } from "@/core/types";
import { getBlockLabel } from "@/core/labels";

interface Block3DIconProps {
  blockType: BlockType;
  variant?: BlockVariant;
  isSelected?: boolean;
  onClick?: () => void;
}

const Block3DIcon: React.FC<Block3DIconProps> = ({ 
  blockType, 
  variant = "block", 
  isSelected = false, 
  onClick 
}) => {
  return (
    <div 
      className={`
        relative h-16 w-16 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-primary bg-primary/50 shadow-lg shadow-primary/25 scale-105 ring-2 ring-primary/30' 
          : 'border-slate-400/40  bg-primary/20 hover:border-primary/60 hover:scale-105 shadow-md shadow-slate-400/20 hover:shadow-lg hover:shadow-primary/15'
        }
        bg-gradient-to-br from-slate-700/15 to-slate-800/20 backdrop-blur-sm
      `}
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [2, 2, 2], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 3, 5]} intensity={1.4} />
        <pointLight position={[1, 2, 1]} intensity={0.6} color="#ffffff" />
        <Block 
          pos={[0, 0, 0]} 
          type={blockType}
          variant={variant as BlockVariant}
          rotation={{ x: 0, y: Math.PI / 4, z: 0 }}
        />
      </Canvas>
      
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-primary rounded-full" />
      )}
    </div>
  );
};

export const Hotbar3D: React.FC = () => {
  const selectedBlock = useWorld(s => s.current);
  const selectedVariant = useWorld(s => s.currentVariant);
  const setSelectedVariant = useWorld(s => s.setCurrentVariant);
  
  // Todas as variantes disponíveis para qualquer bloco
  const allVariants: BlockVariant[] = ["block", "stairs", "slab", "panel", "fence", "grate"];

  // Atalhos de teclado para as variantes
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return; // Evita conflito com inputs
      
      const key = e.key;
      if (key >= '1' && key <= '6') {
        e.preventDefault();
        const index = parseInt(key) - 1;
        if (index < allVariants.length) {
          setSelectedVariant(allVariants[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [allVariants, setSelectedVariant]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-900/25 backdrop-blur-xl rounded-xl border border-slate-300/30 shadow-2xl shadow-slate-900/20 px-5 py-4 flex items-center gap-5 ring-1 ring-white/10">
        
        {/* Bloco selecionado com nome */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Block3DIcon
              blockType={selectedBlock}
              variant={selectedVariant}
              isSelected={true}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-base font-semibold text-slate-50 drop-shadow-sm">
              {getBlockLabel(selectedBlock)}
            </span>
            <span className="text-sm text-slate-200 drop-shadow-sm">
              {selectedVariant === "block" ? "Bloco" : 
               selectedVariant === "stairs" ? "Escada" :
               selectedVariant === "slab" ? "Laje" :
               selectedVariant === "panel" ? "Painel" :
               selectedVariant === "fence" ? "Cerca" :
               "Grade"}
            </span>
          </div>
        </div>

        {/* Divisor */}
        <div className="h-10 w-px bg-slate-300/40 shadow-sm" />

        {/* Variantes */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-200 font-medium drop-shadow-sm">
            Variantes:
          </div>
          <div className="flex gap-2">
            {allVariants.map((variant, index) => (
              <div key={variant} className="relative">
                <Block3DIcon
                  blockType={selectedBlock}
                  variant={variant}
                  isSelected={selectedVariant === variant}
                  onClick={() => setSelectedVariant(variant)}
                />
                {/* Indicador numérico */}
                <div className="absolute -top-1.5 -left-1.5 h-5 w-5 bg-slate-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-slate-900/40 border border-slate-500 ring-1 ring-white/20">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
