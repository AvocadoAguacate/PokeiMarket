INSERT INTO country (name) VALUES
('Costa Rica');

INSERT INTO state (country_id, name) VALUES
(1, 'San José'),
(1, 'Alajuela'),
(1, 'Cartago'),
(1, 'Heredia'),
(1, 'Guanacaste'),
(1, 'Puntarenas'),
(1, 'Limón');

INSERT INTO city (state_id, name) VALUES
(1, 'San José'),
(1, 'Escazú'),
(1, 'Desamparados'),
(1, 'Puriscal'),
(1, 'Tarrazú'),
(1, 'Aserrí'),
(1, 'Mora'),
(1, 'Goicoechea'),
(1, 'Santa Ana'),
(1, 'Alajuelita'),
(1, 'Vázquez de Coronado'),
(1, 'Acosta'),
(1, 'Tibás'),
(1, 'Moravia'),
(1, 'Montes de Oca'),
(1, 'Turrubares'),
(1, 'Dota'),
(1, 'Curridabat'),
(1, 'Pérez Zeledón'),
(1, 'León Cortés'),
(2, 'Alajuela'),
(2, 'San Ramón'),
(2, 'Grecia'),
(2, 'San Mateo'),
(2, 'Atenas'),
(2, 'Naranjo'),
(2, 'Palmares'),
(2, 'Poás'),
(2, 'Orotina'),
(2, 'San Carlos'),
(2, 'Zarcero'),
(2, 'Sarchí'),
(2, 'Upala'),
(2, 'Los Chiles'),
(2, 'Guatuso'),
(2, 'Alajuela'),
(2, 'San Ramón'),
(2, 'Grecia'),
(2, 'San Mateo'),
(2, 'Atenas'),
(2, 'Naranjo'),
(2, 'Palmares'),
(2, 'Poás'),
(2, 'Orotina'),
(2, 'San Carlos'),
(2, 'Zarcero'),
(2, 'Sarchí'),
(2, 'Upala'),
(2, 'Los Chiles'),
(2, 'Guatuso'),
(3, 'Cartago'),
(3, 'Paraíso'),
(3, 'La Unión'),
(3, 'Jiménez'),
(3, 'Turrialba'),
(3, 'Alvarado'),
(3, 'Oreamuno'),
(3, 'El Guarco');

INSERT INTO users_type (name) VALUES
('Admin'),
('Staff'),
('Client');

INSERT INTO contact_type (name) VALUES
('Phone'),
('Email');

INSERT INTO poke_gender (name) VALUES 
('Male'),
('Female'),
('Shiny');