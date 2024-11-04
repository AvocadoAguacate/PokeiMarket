CREATE TABLE pokemon (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hp INT CHECK (hp BETWEEN 0 AND 255),
    attack INT CHECK (attack BETWEEN 0 AND 255),
    defense INT CHECK (defense BETWEEN 0 AND 255),
    special_attack INT CHECK (special_attack BETWEEN 0 AND 255),
    special_defense INT CHECK (special_defense BETWEEN 0 AND 255),
    speed INT CHECK (speed BETWEEN 0 AND 255),
    weight INT CHECK (weight > 0),
    height INT CHECK (height > 0),
    name_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', name)) STORED
);

CREATE INDEX pokemon_name_fulltext_idx ON pokemon USING GIN (name_tsv);

CREATE TABLE poke_gender (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE learning_method (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE poke_move (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE poke_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE pokemon_x_gender (
    id SERIAL PRIMARY KEY,
    url TEXT,
    pokemon_id INT NOT NULL,
    gender_id INT NOT NULL,
    CONSTRAINT fk_pokemon FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE,
    CONSTRAINT fk_gender FOREIGN KEY (gender_id) REFERENCES poke_gender (id) ON DELETE CASCADE
);

CREATE TABLE pokemon_generation (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL,
    generation INT CHECK (generation > 0),
    CONSTRAINT fk_pokemon_gen FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE
);

CREATE TABLE pokemon_x_moves (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL,
    move_id INT NOT NULL,
    generation INT CHECK (generation > 0),
    method_id INT NOT NULL,
    cost INT CHECK (cost > 0),
    CONSTRAINT fk_pokemon_move FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE,
    CONSTRAINT fk_move FOREIGN KEY (move_id) REFERENCES poke_move (id) ON DELETE CASCADE,
    CONSTRAINT fk_method FOREIGN KEY (method_id) REFERENCES learning_method (id) ON DELETE CASCADE
);

CREATE TABLE poke_product (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL,
    gender_id INT NOT NULL,
    generation INT CHECK (generation > 0),
    base_cost INT CHECK (base_cost > 0),
    check_sum VARCHAR(255),
    CONSTRAINT fk_product_pokemon FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE,
    CONSTRAINT fk_product_gender FOREIGN KEY (gender_id) REFERENCES pokemon_x_gender (id) ON DELETE CASCADE
);

CREATE TABLE pokemon_x_type (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL,
    type_id INT NOT NULL,
    CONSTRAINT fk_pokemon_type FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE,
    CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES poke_type (id) ON DELETE CASCADE
);

CREATE TABLE poke_item_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE poke_item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cost INT CHECK (cost > 0),
    type_id INT NOT NULL,
    name_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', name)) STORED,
    CONSTRAINT fk_item_type FOREIGN KEY (type_id) REFERENCES poke_item_type (id) ON DELETE CASCADE
);

CREATE INDEX poke_item_name_fulltext_idx ON poke_item USING GIN (name_tsv);

CREATE TABLE poke_item_stock (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    pc_zone_id INT NOT NULL,
    status_id INT NOT NULL,
    CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES poke_item (id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_zone FOREIGN KEY (pc_zone_id) REFERENCES store (id) ON DELETE CASCADE,
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES status (id) ON DELETE CASCADE
);

CREATE TABLE pokemon_stock_item (
    id SERIAL PRIMARY KEY,
    poke_product_id INT NOT NULL,
    pc_zone_id INT NOT NULL,
    status_id INT NOT NULL,
    CONSTRAINT fk_poke_product FOREIGN KEY (poke_product_id) REFERENCES poke_product (id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_zone FOREIGN KEY (pc_zone_id) REFERENCES store (id) ON DELETE CASCADE,
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES status (id) ON DELETE CASCADE
);

CREATE TABLE card (
    id SERIAL PRIMARY KEY,
    card_number BYTEA NOT NULL,
    last_numbers VARCHAR(4) NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    card_code BYTEA NOT NULL,
    user_id UUID NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    client_id UUID NOT NULL, 
    final_price NUMERIC(10, 2) CHECK (final_price >= 0),
    card_id INT NOT NULL,
    discount NUMERIC(10, 2) CHECK (discount >= 0),
    taxes NUMERIC(10, 2) CHECK (taxes > 0),
    check_sum VARCHAR(255),
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_card FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE
);

CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    item_stock_id INT,
    pokemon_stock_id INT,
    unit_cost INT CHECK (unit_cost > 0),
    quantity INT CHECK (quantity > 0),
    check_sum VARCHAR(255),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_stock FOREIGN KEY (item_stock_id) REFERENCES poke_item_stock (id) ON DELETE SET NULL,
    CONSTRAINT fk_pokemon_stock FOREIGN KEY (pokemon_stock_id) REFERENCES pokemon_stock_item (id) ON DELETE SET NULL,
    CONSTRAINT chk_one_null CHECK (
        (item_stock_id IS NULL AND pokemon_stock_id IS NOT NULL) OR 
        (item_stock_id IS NOT NULL AND pokemon_stock_id IS NULL)
    )
);

CREATE TABLE order_item_adds (
    id SERIAL PRIMARY KEY,
    order_item_id INT NOT NULL,
    mov1 INT,
    mov2 INT,
    mov3 INT,
    mov4 INT,
    level INT CHECK (level > 0),
    CONSTRAINT fk_order_item FOREIGN KEY (order_item_id) REFERENCES order_item (id) ON DELETE CASCADE,
    CONSTRAINT fk_mov1 FOREIGN KEY (mov1) REFERENCES pokemon_x_moves (id) ON DELETE SET NULL,
    CONSTRAINT fk_mov2 FOREIGN KEY (mov2) REFERENCES pokemon_x_moves (id) ON DELETE SET NULL,
    CONSTRAINT fk_mov3 FOREIGN KEY (mov3) REFERENCES pokemon_x_moves (id) ON DELETE SET NULL,
    CONSTRAINT fk_mov4 FOREIGN KEY (mov4) REFERENCES pokemon_x_moves (id) ON DELETE SET NULL,
    CONSTRAINT chk_movs_different CHECK (
        mov1 IS DISTINCT FROM mov2 AND
        mov1 IS DISTINCT FROM mov3 AND
        mov1 IS DISTINCT FROM mov4 AND
        mov2 IS DISTINCT FROM mov3 AND
        mov2 IS DISTINCT FROM mov4 AND
        mov3 IS DISTINCT FROM mov4
    )
);

CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    type_id INT NOT NULL,
    user_id UUID NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    check_sum TEXT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES store (id) ON DELETE CASCADE,
    CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES users_type (id) ON DELETE CASCADE
);

CREATE TABLE discount (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    promotion_code VARCHAR(50) NOT NULL UNIQUE,
    admin_id INT NOT NULL, 
    percent_discount INT CHECK (percent_discount >= 0 AND percent_discount <= 100),
    start TIMESTAMP NOT NULL,
    finish TIMESTAMP NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    check_sum VARCHAR(255),
    CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES staff (id) ON DELETE CASCADE,
    CONSTRAINT chk_discount_time CHECK (start < finish)
);

CREATE TABLE order_discount (
    id SERIAL PRIMARY KEY,
    discount_id INT NOT NULL,
    order_id INT NOT NULL,
    check_sum VARCHAR(255),
    CONSTRAINT fk_discount FOREIGN KEY (discount_id) REFERENCES discount (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_discount FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE state (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    country_id INT NOT NULL,
    CONSTRAINT fk_country FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE
);

CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    state_id INT NOT NULL,
    CONSTRAINT fk_state FOREIGN KEY (state_id) REFERENCES state (id) ON DELETE CASCADE
);

CREATE TABLE delivery_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE contact_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    location GEOMETRY NOT NULL,
    postal_code INT NOT NULL,
    city_id INT NOT NULL,
    CONSTRAINT fk_city FOREIGN KEY (city_id) REFERENCES city (id) ON DELETE CASCADE
);

-- CREATE TABLE auth_user_user_metadata (
--     user_id INT PRIMARY KEY, -- id de auth.users
--     type_id INT NOT NULL,
--     name TEXT NOT NULL,
--     check_sum TEXT NOT NULL,
--     CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES users_type (id) ON DELETE CASCADE
-- );



CREATE TABLE address_x_store (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    address_id INT NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES store (id) ON DELETE CASCADE,
    CONSTRAINT fk_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE
);

CREATE TABLE address_x_client (
    id SERIAL PRIMARY KEY,
    client_id UUID NOT NULL,
    address_id INT NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE
);

CREATE TABLE order_delivery (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    status_id INT NOT NULL,
    type_id INT NOT NULL,
    address_id INT NOT NULL,
    last_update TIMESTAMP NOT NULL,
    expected_delivery_date TIMESTAMP NOT NULL,
    start_time_client TIME NOT NULL,
    end_time_client TIME NOT NULL,
    operator_id INT NOT NULL,
    check_sum TEXT NOT NULL,
    CONSTRAINT chk_time_range CHECK (start_time_client < end_time_client),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES status (id) ON DELETE CASCADE,
    CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES delivery_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_address FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE,
    CONSTRAINT fk_operator FOREIGN KEY (operator_id) REFERENCES staff (id) ON DELETE CASCADE
);

CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    value TEXT NOT NULL,
    type_id INT NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES contact_type (id) ON DELETE CASCADE
);

CREATE TABLE saved_item (
    id SERIAL PRIMARY KEY,
    poke_item_id INT,
    poke_product_id INT,
    quantity INT CHECK (quantity > 0),
    client_id UUID NOT NULL,
    status_id INT NOT NULL,
    CONSTRAINT chk_item_or_product CHECK (
        (poke_item_id IS NULL AND poke_product_id IS NOT NULL) OR
        (poke_item_id IS NOT NULL AND poke_product_id IS NULL)
    ),
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_item FOREIGN KEY (poke_item_id) REFERENCES poke_item (id) ON DELETE SET NULL,
    CONSTRAINT fk_product FOREIGN KEY (poke_product_id) REFERENCES poke_product (id) ON DELETE SET NULL,
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES status (id) ON DELETE SET NULL
);

CREATE TABLE saved_item_adds (
    id SERIAL PRIMARY KEY,
    saved_item_id INT NOT NULL,
    gender_id INT NOT NULL,
    mov1 INT NOT NULL,
    mov2 INT NOT NULL,
    mov3 INT NOT NULL,
    mov4 INT NOT NULL,
    level INT CHECK (level > 0),
    CONSTRAINT fk_saved_item FOREIGN KEY (saved_item_id) REFERENCES saved_item (id) ON DELETE CASCADE,
    CONSTRAINT fk_gender FOREIGN KEY (gender_id) REFERENCES pokemon_x_gender (id) ON DELETE CASCADE,
    CONSTRAINT fk_mov1 FOREIGN KEY (mov1) REFERENCES pokemon_x_moves (id) ON DELETE CASCADE,
    CONSTRAINT fk_mov2 FOREIGN KEY (mov2) REFERENCES pokemon_x_moves (id) ON DELETE CASCADE,
    CONSTRAINT fk_mov3 FOREIGN KEY (mov3) REFERENCES pokemon_x_moves (id) ON DELETE CASCADE,
    CONSTRAINT fk_mov4 FOREIGN KEY (mov4) REFERENCES pokemon_x_moves (id) ON DELETE CASCADE,
    CONSTRAINT chk_unique_moves CHECK (
        mov1 IS DISTINCT FROM mov2 AND
        mov1 IS DISTINCT FROM mov3 AND
        mov1 IS DISTINCT FROM mov4 AND
        mov2 IS DISTINCT FROM mov3 AND
        mov2 IS DISTINCT FROM mov4 AND
        mov3 IS DISTINCT FROM mov4
    )
);

CREATE TABLE wish_pokemon (
    id SERIAL PRIMARY KEY,
    status_id INT NOT NULL,
    admin_id INT NOT NULL,
    last_update TIMESTAMP NOT NULL,
    interest INT NOT NULL,
    pokedex_id INT NOT NULL,
    check_sum TEXT NOT NULL,
    CONSTRAINT fk_status FOREIGN KEY (status_id) REFERENCES status (id) ON DELETE CASCADE,
    CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES staff (id) ON DELETE CASCADE
);

CREATE TABLE wish_x_user (
    id SERIAL PRIMARY KEY,
    wish_id INT NOT NULL,
    user_id UUID NOT NULL,
    saved_id INT NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_wish FOREIGN KEY (wish_id) REFERENCES wish_pokemon (id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_item FOREIGN KEY (saved_id) REFERENCES saved_item (id) ON DELETE CASCADE
);


