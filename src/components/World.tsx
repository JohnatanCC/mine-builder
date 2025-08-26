import { useWorld } from '../state/world.store';
import { parseKey } from '../core/keys';
import { Block } from './Block';

export function World() {
  const blocks = useWorld(s => s.blocks);
  return (
    <>
      {Array.from(blocks.entries()).map(([k, data]) => (
        <Block 
          key={k} 
          pos={parseKey(k)} 
          type={data.type} 
          variant={data.variant || "block"}
          rotation={data.rotation || { x: 0, y: 0, z: 0 }}
          shape={data.shape || "straight"}
        />
      ))}
    </>
  );
}
