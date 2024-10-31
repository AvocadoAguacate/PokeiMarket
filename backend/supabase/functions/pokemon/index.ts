// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { Pokemon, GenderData, MoveData, AddPokemonParams } from "./pokemon.model.ts"
import { generations } from '../generations.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("Hello from Pokemon Function")

interface Task {
  name: string
  status: number
}

async function getTask(supabaseClient: SupabaseClient, id: string) {
  const { data: task, error } = await supabaseClient.from('tasks').select('*').eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify({ task }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function getAllTasks(supabaseClient: SupabaseClient) {
  const { data: tasks, error } = await supabaseClient.from('tasks').select('*')
  if (error) throw error

  return new Response(JSON.stringify({ tasks }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function deleteTask(supabaseClient: SupabaseClient, id: string) {
  const { error } = await supabaseClient.from('tasks').delete().eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify({}), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function updateTask(supabaseClient: SupabaseClient, id: string, task: Task) {
  const { error } = await supabaseClient.from('tasks').update(task).eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify({ task }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function createTask(supabaseClient: SupabaseClient, task: Task) {
  const { error } = await supabaseClient.from('tasks').insert(task)
  if (error) throw error

  return new Response(JSON.stringify({ task }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

Deno.serve(async (req) => {
  const { url, method } = req

  // This is needed if you're planning to invoke your function from a browser.
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Patrones para las rutas
    const pokemonPattern = new URLPattern({ pathname: "/pokemon/:id/" });
    const movePattern = new URLPattern({ pathname: "/pokemon/:id/move/:moveId/" });
    const productPattern = new URLPattern({ pathname: "/pokemon/:id/product/:productId/" });
    const queryPattern = new URLPattern({ pathname: "/pokemon/" });

    const pokemonMatch = pokemonPattern.exec(url);
    const moveMatch = movePattern.exec(url);
    const productMatch = productPattern.exec(url);
    const queryMatch = queryPattern.exec(url);

    const pokemonId = pokemonMatch ? pokemonMatch.pathname.groups.id : null;
    const moveId = moveMatch ? moveMatch.pathname.groups.moveId : null;
    const productId = pokemonMatch ? pokemonMatch.pathname.groups.productId : null;

    const { searchParams } = new URL(url);
    const types = searchParams.get("types")?.split(",") ?? [];
    const generation = searchParams.get("generation")
      ? parseInt(searchParams.get("generation")!, 10)
      : null;

    let body = null
    if (method === 'POST' || method === 'PUT') {
      body = await req.json()
    }

    // call relevant method based on method and id
    switch (true) {
      case productId && method === 'PUT':
        return updatePokemon(supabaseClient, pokemonId);
      case moveId && pokemonId && method === 'PUT':// modificar el precio de un move
        return updateMove(supabaseClient, moveId, pokemonId);
      case pokemonId && method === 'PUT':
        return updatePokemon(supabaseClient, pokemonId);
      case !pokemonId && method === 'POST':
        return addPokemon(supabaseClient, body);
      case pokemonId && method === 'GET':
        return getPokemons(supabaseClient, pokemonId)
      default:
        return getAllPokemons(supabaseClient)
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})

async function updateMove(SupabaseClient: SupabaseClient, moveId: any, pokemonId: any) {
  
}

async function updatePokemon(supabaseClient: SupabaseClient, pokemonId: any) {
  throw new Error("Function not implemented.")
}

async function addPokemon(supabaseClient: SupabaseClient, body: any) {
  console.log(`Agregando el pokemon: ${body.id}`); 
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${body.id}`);
  const data = await response.json();
  try {
    const pokedata:Pokemon = data;
    console.log(pokedata.name);
    let hpStat = pokedata.stats.find(stat => stat.stat.name === 'hp');
    let hp = hpStat ? hpStat.base_stat : 1;
    let attackStat = pokedata.stats.find(stat => stat.stat.name === 'attack');
    let attack = attackStat ? attackStat.base_stat : 0;
    let defenseStat = pokedata.stats.find(stat => stat.stat.name === 'defense');
    let defense = defenseStat ? defenseStat.base_stat : 0;
    let specialAttackStat = pokedata.stats.find(stat => stat.stat.name === 'special-attack');
    let specialAttack = specialAttackStat ? specialAttackStat.base_stat : 0;
    let specialDefenseStat = pokedata.stats.find(stat => stat.stat.name === 'special-defense');
    let specialDefense = specialDefenseStat ? specialDefenseStat.base_stat : 0;
    let speedStat = pokedata.stats.find(stat => stat.stat.name === 'speed');
    let speed = speedStat ? speedStat.base_stat : 0;
    console.log(`HP: ${hp}`);
    console.log(`Attack: ${attack}`);
    console.log(`Defense: ${defense}`);
    console.log(`Special Attack: ${specialAttack}`);
    console.log(`Special Defense: ${specialDefense}`);
    console.log(`Speed: ${speed}`);
    let types = pokedata.types.map(type => type.type.name);
    console.log(types);
    let genders:GenderData[] = [];
    if (pokedata.sprites.other?.home.front_default) {
      genders.push({
          poke_gender_id: 1,
          poke_url: pokedata.sprites.other.home.front_default,
      });
    }
    if (pokedata.sprites.other?.home.front_female) {
        genders.push({
            poke_gender_id: 2,
            poke_url: pokedata.sprites.other.home.front_female,
        });
    }
    if (pokedata.sprites.other?.home.front_shiny) {
        genders.push({
            poke_gender_id: 3,
            poke_url: pokedata.sprites.other.home.front_shiny,
        });
    }
    console.log(genders);
    let moves: MoveData[] = pokedata.moves.flatMap((move):MoveData[] => {
      return move.version_group_details.map((details):MoveData => {
        return {
          move: move.move.name,
          method: details.move_learn_method.name,
          generation: getGenerationByGroupName(details.version_group.name),
          cost: details.level_learned_at > 0 ? details.level_learned_at : 10
        }
      }); 
    });
    // Usamos reduce para acumular solo el movimiento con la menor generación
    let uniqueMoves = moves.reduce((acc, current) => {
      // Verificamos si ya tenemos este movimiento en el acumulador
      let existingMove = acc.find(move => move.move === current.move);
      
      // Si no existe, lo agregamos
      if (!existingMove) {
        acc.push(current);
      } else if (current.generation < existingMove.generation) {
        // Si ya existe, verificamos si la generación actual es menor
        let index = acc.indexOf(existingMove);
        acc[index] = current; // Reemplazamos con el movimiento actual
      }
      
      return acc;
    }, []);
    console.log(uniqueMoves);
    
    let uniqueGenerations = [...new Set(moves.map(move => move.generation))];
    console.log(uniqueGenerations);

    const newPokemon: AddPokemonParams = {
      p_id: pokedata.id,
      p_name: pokedata.name,
      p_hp: hp,
      p_attack: attack,
      p_defense: defense,
      p_special_attack: specialAttack,
      p_special_defense: specialDefense,
      p_speed: speed,
      p_weight: pokedata.weight,
      p_height: pokedata.height,
      p_types: types,
      p_genders: genders,
      p_moves: uniqueMoves,
      p_generations: uniqueGenerations,
    };

    const { dataDB, error } = await supabaseClient.rpc('add_pokemon', newPokemon);
    if(error) console.log(error);
    return new Response(JSON.stringify(dataDB), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
}

async function getPokemons(supabaseClient: SupabaseClient, pokemonId: any) {
  throw new Error("Function not implemented.")
}

async function getAllPokemons(supabaseClient: SupabaseClient) {
  throw new Error("Function not implemented.")
}
function getGenerationByGroupName(groupName:string):number {
  for (const generation of generations) {
    for (const group of generation.groups) {
      if (group.groupName === groupName) {
        return Number(generation.generationId);
      }
    }
  }
  return 1;
}
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/pokemon' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
