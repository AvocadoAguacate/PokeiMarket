// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { PokemonProduct, PokemonStockItemParams } from "./stock.model.ts"

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
    console.log(`Url: ${url}`)//http://supabase_edge_runtime_backend:8081/stock/product
    const pokemonPatternId = new URLPattern({ pathname: "/stock/pokemon/:pokemonId" });
    const productPatternId = new URLPattern({ pathname: "stock/product/:productId" });
    const itemPatternId = new URLPattern({ pathname: "/stock/item/:itemId"});

    const pokemonPattern = new URLPattern({ pathname: "/stock/pokemon" });
    const productPattern = new URLPattern({ pathname: "/stock/product" });
    const itemPattern = new URLPattern({ pathname: "/stock/item"});

    const pokemonMatchId = pokemonPatternId.exec(url);
    const productMatchId = productPatternId.exec(url);
    const itemMatchId = itemPatternId.exec(url);

    const pokemonMatch = pokemonPattern.exec(url);
    const productMatch = productPattern.exec(url);
    const itemMatch = itemPattern.exec(url);

    const pokemonId = pokemonMatchId ? pokemonMatchId.pathname.groups.id : null;
    const productId = productMatchId ? productMatchId.pathname.groups.moveId : null;
    const itemId = itemMatchId ? itemMatchId.pathname.groups.productId : null;
    // Mostrar los resultados de los matches
    console.log('pokemonMatchId:', pokemonMatchId);
    console.log('productMatchId:', productMatchId);
    console.log('itemMatchId:', itemMatchId);
    console.log('pokemonMatch:', pokemonMatch);
    console.log('productMatch:', productMatch);
    console.log('itemMatch:', itemMatch);

    let body = null
    if (method === 'POST' || method === 'PUT') {
      body = await req.json()
    }

    // call relevant method based on method and id
    switch (true) {
      case productMatch && method === 'POST':
        console.log('Por aquí');
        return addProduct(supabaseClient, body);
      case productId && method === 'PUT':
        return updateProduct(supabaseClient, pokemonId, body);
      case pokemonMatch && method === 'POST':
        return addStock(supabaseClient, body);
      //TODO: get of produt and get, post y put de stock de pokemon y item
      default:
        console.log('default');
        return addStock(supabaseClient, body);
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
  const salt = Deno.env.get('SALT');
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

async function addStock(supabaseClient: any, body: any) {
  console.log(body);
  const newStock: PokemonStockItemParams = {
    p_poke_product_id: body.poke_product_id,
    p_pc_zone_id: body.store_id,
    p_status_id: body.status_id
  }
  const { dataDB, error } = await supabaseClient.rpc('add_pokemon_stock_item', newStock);
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
