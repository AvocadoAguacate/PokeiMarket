CREATE TABLE poke_product_log (
    id SERIAL PRIMARY KEY,
    poke_product_id INT NOT NULL,
    staff_id INT NOT NULL,
    previous_price INT NOT NULL CHECK (previous_price > 0),
    new_price INT NOT NULL CHECK (new_price > 0),  
    change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_sum VARCHAR(255),
    CONSTRAINT fk_log_product FOREIGN KEY (poke_product_id) REFERENCES poke_product (id) ON DELETE NO ACTION,
    CONSTRAINT fk_log_staff FOREIGN KEY (staff_id) REFERENCES staff (id) ON DELETE NO ACTION
);

CREATE TABLE poke_item_log (
    id SERIAL PRIMARY KEY,
    poke_item_id INT NOT NULL,
    staff_id INT NOT NULL,
    previous_cost INT NOT NULL CHECK (previous_cost > 0),
    new_cost INT NOT NULL CHECK (new_cost > 0),
    change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_sum VARCHAR(255),
    CONSTRAINT fk_log_item FOREIGN KEY (poke_item_id) REFERENCES poke_item (id) ON DELETE NO ACTION,
    CONSTRAINT fk_log_staff FOREIGN KEY (staff_id) REFERENCES staff (id) ON DELETE NO ACTION
);

CREATE TABLE discount_log (
    id SERIAL PRIMARY KEY,
    discount_id INT NOT NULL,
    admin_id INT NOT NULL,
    previous_percent_discount INT NOT NULL CHECK (previous_percent_discount >= 0 AND previous_percent_discount <= 100),
    new_percent_discount INT NOT NULL CHECK (new_percent_discount >= 0 AND new_percent_discount <= 100),
    change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_sum VARCHAR(255),
    CONSTRAINT fk_log_discount FOREIGN KEY (discount_id) REFERENCES discount (id) ON DELETE NO ACTION,
    CONSTRAINT fk_log_admin FOREIGN KEY (admin_id) REFERENCES staff (id) ON DELETE NO ACTION
);

CREATE TABLE staff_log (
    id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL,
    admin_id INT NOT NULL,
    previous_store_id INT,
    new_store_id INT,
    previous_type_id INT,
    new_type_id INT,
    previous_isDeleted BOOLEAN,
    new_isDeleted BOOLEAN,
    change_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_sum TEXT,
    CONSTRAINT fk_log_staff FOREIGN KEY (staff_id) REFERENCES staff (id) ON DELETE NO ACTION,
    CONSTRAINT fk_log_admin FOREIGN KEY (admin_id) REFERENCES staff (id) ON DELETE NO ACTION
);