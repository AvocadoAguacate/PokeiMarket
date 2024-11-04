export interface PokemonProduct {
  p_pokemon_id: number;
  p_gender_id: number;
  p_generation: number;
  p_base_cost: number;
  p_salt: string;
}

export interface PokemonStockItemParams {
  p_poke_product_id: number;
  p_pc_zone_id: number;
  p_status_id: number;
}