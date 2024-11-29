export interface PokemonList {
  id:         number;
  name:       string;
  basecost:   number;
  img:        string;
  generation: number;
}
export interface PokemonDetail {
  id:              number;
  name:            string;
  hp:              number;
  attack:          number;
  defense:         number;
  special_attack:  number;
  special_defense: number;
  speed:           number;
  weight:          number;
  height:          number;
  gender_name:     string;
  img:             string;
  base_cost:       number;
  generation:      number;
  types:           string;
}