// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { PokemonProduct } from "./stock.model.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

console.log("Hello from Stock Function")


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
    const pokemonPattern = new URLPattern({ pathname: "/stock/pokemon/:pokemonId/" });
    const productPattern = new URLPattern({ pathname: "stock/product/:productId/" });
    const itemPattern = new URLPattern({ pathname: "/stock/item/:itemId/"});

    const pokemonMatch = pokemonPattern.exec(url);
    const productMatch = productPattern.exec(url);
    const itemMatch = itemPattern.exec(url);

    const pokemonId = pokemonMatch ? pokemonMatch.pathname.groups.id : null;
    const productId = productMatch ? productMatch.pathname.groups.moveId : null;
    const itemId = itemMatch ? itemMatch.pathname.groups.productId : null;

    let body = null
    if (method === 'POST' || method === 'PUT') {
      body = await req.json()
    }

    // call relevant method based on method and id
    switch (true) {
      case productMatch && method === 'POST':
        return addProduct(supabaseClient, body);
      case productId && pokemonId && method === 'PUT':
        return updateProduct(supabaseClient, pokemonId, body);
      //TODO: get of produt and get, post y put de stock de pokemon y item
      default:
        return addProduct(supabaseClient, body);
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})


async function updateProduct(supabaseClient: any, pokemonId: any, body: any) {
  throw new Error("Function not implemented.");
}

async function addProduct(supabaseClient: any, body: any) {
  console.log(body);
  console.log(Deno.env.get('SALT'))
  const newProduct: PokemonProduct = {
    p_pokemon_id: body.pokemon_id,
    p_gender_id: body.gender_id,
    p_generation: body.generation,
    p_base_cost: body.cost,
    p_salt: "temp_salt_00!"//TODO change to env
  }
  console.log(newProduct);
  const { dataDB, error } = await supabaseClient.rpc('add_product', newProduct);
  if(error) console.log(error);
  if(dataDB) console.log(dataDB);
  return new Response(JSON.stringify(dataDB), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stock' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
