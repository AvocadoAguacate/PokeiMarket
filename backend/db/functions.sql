CREATE TYPE gender_data AS (
    poke_gender_id INT,
    poke_url TEXT
);

CREATE TYPE move_data AS (
    move TEXT,
    method TEXT,
    generation INT,
    cost INT
);

CREATE OR REPLACE FUNCTION add_pokemon(
    p_id INT,
    p_name VARCHAR(255),
    p_hp INT,
    p_attack INT,
    p_defense INT,
    p_special_attack INT,
    p_special_defense INT,
    p_speed INT,
    p_weight INT,
    p_height INT,
    p_types TEXT[],
    p_genders gender_data[],
    p_moves move_data[],
    p_generations INT[]
) RETURNS VOID AS $$
DECLARE
    new_pokemon_id INTEGER;
    type_id INTEGER;
    poke_type_name TEXT;
    poke_generation INTEGER;
    gender_item gender_data;
    move_item move_data;
    mthod_id INTEGER;
    mov_id INTEGER;
BEGIN
    -- Insertar el Pokémon
    INSERT INTO pokemon (
        id, name, hp, attack, defense, special_attack, special_defense, speed, weight, height
    ) VALUES (
        p_id, p_name, p_hp, p_attack, p_defense, p_special_attack, 
        p_special_defense, p_speed, p_weight, p_height
    )
    RETURNING id INTO new_pokemon_id;

    -- Manejo de tipos de Pokémon
    FOREACH poke_type_name IN ARRAY p_types
    LOOP
        SELECT id INTO type_id FROM poke_type WHERE poke_type.name = poke_type_name;
        IF NOT FOUND THEN
            INSERT INTO poke_type (name) VALUES (poke_type_name) RETURNING id INTO type_id;
        END IF;
        INSERT INTO pokemon_x_type (pokemon_id, type_id) VALUES (new_pokemon_id, type_id);
    END LOOP;

    -- Manejo de géneros de Pokémon
    FOREACH gender_item IN ARRAY p_genders
    LOOP
        INSERT INTO pokemon_x_gender (pokemon_id, gender_id, url)
        VALUES (new_pokemon_id, gender_item.poke_gender_id, gender_item.poke_url);
    END LOOP;

    -- Manejo de movimientos de Pokémon
    FOREACH move_item IN ARRAY p_moves
    LOOP
        -- Verificar si el método ya existe
        SELECT id INTO mthod_id FROM learning_method WHERE learning_method.name = move_item.method;
        IF NOT FOUND THEN
            INSERT INTO learning_method (name) VALUES (move_item.method) RETURNING id INTO mthod_id;
        END IF;

        -- Verificar si el movimiento ya existe
        SELECT id INTO mov_id FROM poke_move WHERE poke_move.name = move_item.move;
        IF NOT FOUND THEN
            INSERT INTO poke_move (name) VALUES (move_item.move) RETURNING id INTO mov_id;
        END IF;

        -- Insertar en la tabla pokemon_x_moves
        INSERT INTO pokemon_x_moves (pokemon_id, move_id, generation, method_id, cost)
        VALUES (new_pokemon_id, mov_id, move_item.generation, mthod_id, move_item.cost);
    END LOOP;

    -- Manejo de generaciones de Pokémon
    FOREACH poke_generation IN ARRAY p_generations
    LOOP
        INSERT INTO pokemon_generation (pokemon_id, generation)
        VALUES (new_pokemon_id, poke_generation);
    END LOOP;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al insertar Pokémon: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Test
-- WITH squirtle_genders AS (
--     SELECT ARRAY[ROW(1, 'url_img_squirtle.png')::gender_data, ROW(2, 'url_img_squirtle_female.png')::gender_data] AS genders
-- ),
-- gyarados_genders AS (
--     SELECT ARRAY[
--         ROW(1, 'url_img_gyarados.png')::gender_data, 
--         ROW(3, 'url_img_gyarados_other.png')::gender_data
--     ] AS genders
-- ),
-- gyarados_moves AS (
--     SELECT ARRAY[
--         ROW('Hydro Pump', 'Level Up', 1, 10)::move_data,
--         ROW('Dragon Dance', 'Level Up', 1, 100)::move_data
--     ] AS moves
-- )
-- SELECT 
--     add_pokemon_transactional(
--         2, 
--         'Gyarados', 
--         95, 
--         125, 
--         79, 
--         60, 
--         100, 
--         81, 
--         235, 
--         6, 
--         ARRAY['Agua', 'Volador']::TEXT[],  
--         (SELECT genders FROM gyarados_genders),
--         (SELECT moves FROM gyarados_moves),
--         ARRAY[1,2,4]::INT[]
--     );

-- SELECT * FROM pokemon;
-- SELECT * FROM poke_type;
-- SELECT * FROM pokemon_x_type;
-- SELECT * FROM pokemon_x_gender;
-- SELECT * FROM learning_method;
-- SELECT * FROM poke_move;
-- SELECT * FROM pokemon_x_moves;
-- SELECT * FROM pokemon_generation;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION add_product(
    p_pokemon_id INT,
    p_gender_id INT,
    p_generation INT,
    p_base_cost INT,
    p_salt TEXT
) RETURNS VOID AS $$
DECLARE
    product_id INTEGER;
    calculated_check_sum TEXT;
BEGIN
    -- Generar el check_sum utilizando hmac con sha256, usando la salt y los valores del registro
    calculated_check_sum := encode(
        hmac(
            p_salt::bytea,
            (p_pokemon_id::text  || p_gender_id::text  || p_generation::text  || p_base_cost::text  || p_base_cost::text )::bytea, 
            'sha256'
        ),
        'hex'
    );
    -- Insertar el producto en la tabla poke_product con el check_sum calculado
    INSERT INTO poke_product (
        pokemon_id, gender_id, generation, base_cost, check_sum
    ) VALUES (
        p_pokemon_id, p_gender_id, p_generation, p_base_cost, calculated_check_sum
    )
    RETURNING id INTO product_id;

    RAISE NOTICE 'Producto insertado correctamente con ID % y check_sum %', product_id, calculated_check_sum;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al insertar producto: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_pokemon_stock_item(
    p_poke_product_id INT,
    p_pc_zone_id INT,
    p_status_id INT
) RETURNS VOID AS $$
DECLARE
    stock_item_id INTEGER;
BEGIN
    -- Verificar si el producto existe en poke_product
    PERFORM id FROM poke_product WHERE id = p_poke_product_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El producto con ID % no existe.', p_poke_product_id;
    END IF;

    -- Verificar si la zona existe en la tabla store
    PERFORM id FROM store WHERE id = p_pc_zone_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'La zona de PC con ID % no existe.', p_pc_zone_id;
    END IF;

    -- Verificar si el estado existe en la tabla status
    PERFORM id FROM status WHERE id = p_status_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El estado con ID % no existe.', p_status_id;
    END IF;

    -- Insertar el item en pokemon_stock_item
    INSERT INTO pokemon_stock_item (
        poke_product_id, pc_zone_id, status_id
    ) VALUES (
        p_poke_product_id, p_pc_zone_id, p_status_id
    )
    RETURNING id INTO stock_item_id;

    RAISE NOTICE 'Item de stock insertado correctamente con ID %', stock_item_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al insertar item de stock: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
