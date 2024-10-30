// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { Pokemon } from "./pokemon.model.ts"

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
    const queryPattern = new URLPattern({ pathname: "/pokemon/" });

    const pokemonMatch = pokemonPattern.exec(url);
    const moveMatch = movePattern.exec(url);
    const queryMatch = queryPattern.exec(url);

    const pokemonId = pokemonMatch ? pokemonMatch.pathname.groups.id : null;
    const moveId = moveMatch ? moveMatch.pathname.groups.moveId : null;

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
    const pokeTest:Pokemon = data;
    console.log(pokeTest.name);
    return new Response(JSON.stringify(pokeTest), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
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
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/pokemon' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
