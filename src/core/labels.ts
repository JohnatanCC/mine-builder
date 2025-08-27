import type { BlockType } from "./types";

export const BLOCK_LABEL: Record<BlockType, string> = {
  stone: "Pedra",
  glass: "Vidro",
  grass: "Grama",
  dirt: "Terra",
  stone_brick: "Tijolo de pedra",
  chiseled_stone_bricks: "Tijolos de Pedra Cinzelados",
  cobblestone: "Pedregulho",
  deepslate_tiles: "Ladrilhos de Ardósia Profunda",
  amethyst_block: "Bloco de Ametista",
  bedrock: "Rocha Mãe",
  oak_planks: "Madeira Carvalho",
  spruce_planks: "Madeira Pinheiro",
  birch_planks: "Madeira Bétula",
  oak_log: "Tronco Carvalho",
  spruce_log: "Tronco Pinheiro",
  birch_log: "Tronco Bétula",
  oak_leaves: "Folhas Carvalho",
  spruce_leaves: "Folhas Pinheiro",
  birch_leaves: "Folhas Bétula",
  brick: "Tijolos",
  redstone_lamp_on: "Lâmpada de Redstone",
  bookshelf: "Estante de Livros",
  // Concretos
  white_concrete: "Concreto Branco",
  gray_concrete: "Concreto Cinza",
  black_concrete: "Concreto Preto",
  red_concrete: "Concreto Vermelho",
  blue_concrete: "Concreto Azul",
  yellow_concrete: "Concreto Amarelo",
  green_concrete: "Concreto Verde",
  orange_concrete: "Concreto Laranja",
  purple_concrete: "Concreto Roxo",
  pink_concrete: "Concreto Rosa",
  cyan_concrete: "Concreto Ciano",
  lime_concrete: "Concreto Lima",
  magenta_concrete: "Concreto Magenta",
  brown_concrete: "Concreto Marrom",
  // Vidros coloridos
  black_stained_glass: "Vidro Preto",
  blue_stained_glass: "Vidro Azul",
  brown_stained_glass: "Vidro Marrom",
  cyan_stained_glass: "Vidro Ciano",
  gray_stained_glass: "Vidro Cinza",
  green_stained_glass: "Vidro Verde",
  light_blue_stained_glass: "Vidro Azul Claro",
  light_gray_stained_glass: "Vidro Cinza Claro",
  lime_stained_glass: "Vidro Lima",
  magenta_stained_glass: "Vidro Magenta",
  orange_stained_glass: "Vidro Laranja",
  pink_stained_glass: "Vidro Rosa",
  purple_stained_glass: "Vidro Roxo",
  red_stained_glass: "Vidro Vermelho",
  white_stained_glass: "Vidro Branco",
  yellow_stained_glass: "Vidro Amarelo",
  tinted_glass: "Vidro Tingido",
  // Blocos de cobre
  copper_block: "Bloco de Cobre",
  copper_bulb: "Lâmpada de Cobre",
  copper_bulb_lit: "Lâmpada de Cobre Acesa",
  copper_grate: "Grade de Cobre",
  copper_ore: "Minério de Cobre",
  copper_trapdoor: "Alçapão de Cobre",
  cut_copper: "Cobre Lapidado",
  chiseled_copper: "Cobre Cinzelado",
  exposed_copper: "Cobre Exposto",
  exposed_chiseled_copper: "Cobre Exposto Cinzelado",
  exposed_copper_grate: "Grade de Cobre Exposto",
  oxidized_copper: "Cobre Oxidado",
  oxidized_copper_grate: "Grade de Cobre Oxidado",
  weathered_copper: "Cobre Desgastado",
  weathered_copper_grate: "Grade de Cobre Desgastado",
  // Blocos de tuff
  chiseled_tuff: "Tufo Cinzelado",
  chiseled_tuff_bricks: "Tijolos de Tufo Cinzelados",
  polished_tuff: "Tufo Polido",
  // Novos blocos
  crafting_table: "Mesa de Trabalho",
  oak_trapdoor: "Alçapão de Carvalho",
  mossy_cobblestone: "Paralelepípedo Musgoso",
  mossy_stone_bricks: "Tijolos de Pedra Musgosos",
  polished_blackstone: "Pedra Negra Polida",
  polished_blackstone_bricks: "Tijolos de Pedra Negra Polida",
  polished_deepslate: "Ardósia Polida",
  polished_diorite: "Diorito Polido",
  polished_granite: "Granito Polido",
  reinforced_deepslate: "Ardósia Reforçada",
  obsidian: "Obsidiana",
  moss_block: "Bloco de Musgo",
  mud: "Lama",
  mud_bricks: "Tijolos de Lama",
  snow: "Neve",
  shroomlight: "Luz de Cogumelo",
  // Lãs coloridas
  white_wool: "Lã Branca",
  light_gray_wool: "Lã Cinza Claro",
  gray_wool: "Lã Cinza",
  black_wool: "Lã Preta",
  red_wool: "Lã Vermelha",
  orange_wool: "Lã Laranja",
  yellow_wool: "Lã Amarela",
  lime_wool: "Lã Lima",
  green_wool: "Lã Verde",
  cyan_wool: "Lã Ciano",
  light_blue_wool: "Lã Azul Claro",
  blue_wool: "Lã Azul",
  purple_wool: "Lã Roxa",
  magenta_wool: "Lã Magenta",
  pink_wool: "Lã Rosa",
  brown_wool: "Lã Marrom",
  // Outros
  iron_bars: "Barras de Ferro",
};

/**
 * Retorna o label de um bloco com fallback seguro.
 * Se o label não existir, retorna o nome formatado do tipo do bloco.
 */
export const getBlockLabel = (blockType: BlockType): string => {
  if (blockType in BLOCK_LABEL) {
    return BLOCK_LABEL[blockType];
  }
  
  // Fallback: formatar o nome do tipo (ex: "oak_planks" -> "Oak Planks")
  return blockType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Verifica se um label existe para o tipo de bloco.
 */
export const hasBlockLabel = (blockType: BlockType): boolean => {
  return blockType in BLOCK_LABEL;
};

/**
 * Retorna todos os tipos de blocos que possuem labels definidos.
 */
export const getLabeledBlockTypes = (): BlockType[] => {
  return Object.keys(BLOCK_LABEL) as BlockType[];
};
