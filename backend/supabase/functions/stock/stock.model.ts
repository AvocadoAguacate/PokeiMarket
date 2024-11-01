export interface PokemonProduct {
  p_pokemon_id: number;   // ID del Pokémon
  p_gender_id: number;    // ID del género
  p_generation: number;   // Generación del producto
  p_base_cost: number;    // Costo base del producto
  p_salt: string;
}

export interface PokemonStockItemParams {
  p_poke_product_id: number;
  p_pc_zone_id: number;
  p_status_id: number;
}