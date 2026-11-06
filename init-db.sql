
-- Antes de iniciar este proyecto ejecuta este script --
USE tilines_db;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    id          INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    role        ENUM('ADMIN','AUDITOR','CLIENT','SISTEMAS') NOT NULL DEFAULT 'CLIENT',
    user        VARCHAR(30) NOT NULL,
    password    VARCHAR(50) NOT NULL
) engine=InnoDB;

DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products(
    id              INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title           VARCHAR(70) NOT NULL,
    category        VARCHAR(50) NOT NULL,
    description     VARCHAR(100) NOT NULL,
    image           VARCHAR(200) NOT NULL,
    price           DECIMAL(10, 4) NOT NULL,
    rating_rate     DECIMAL(3, 1) NOT NULL,
    rating_count    INT NOT NULL
) engine=InnoDB;

INSERT INTO users (id, name, role, `user`, password) VALUES
    (1,  'john doe',       'SISTEMAS','johnd',     'm38rmF$'),
    (2,  'david morrison', 'AUDITOR', 'mor_2314',  '83r5^_'),
    (3,  'kevin ryan',     'CLIENT',  'kevinryan', 'kev02937@'),
    (4,  'don romer',      'CLIENT',  'donero',    'ewedon'),
    (5,  'derek powell',   'CLIENT',  'derek',     'jklg*_56'),
    (6,  'david russell',  'CLIENT',  'david_r',   '3478*#54'),
    (7,  'miriam snyder',  'CLIENT',  'snyder',    'f238&@*$'),
    (8,  'william hopkins','CLIENT',  'hopkins',   'William56$hj'),
    (9,  'kate hale',      'CLIENT',  'kate_h',    'kfejk@*_'),
    (10, 'jimmie klein',   'CLIENT',  'jimmie_k',  'klein*#%*');

INSERT INTO products (id, title, category, description, image, price, rating_rate, rating_count) VALUES
    (1,  'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', 'men''s clothing', 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png', 109.95, 3.9, 120),
    (2,  'Mens Casual Premium Slim Fit T-Shirts', 'men''s clothing', 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', 22.30, 4.1, 259),
    (3,  'Mens Cotton Jacket', 'men''s clothing', 'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working,', 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', 55.99, 4.7, 500),
    (4,  'Mens Casual Slim Fit', 'men''s clothing', 'The color could be slightly different between on the screen and in practice. / Please note that', 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', 15.99, 2.1, 430),
    (5,  'John Hardy Women''s Legends Naga Gold & Silver Dragon Station Chain', 'jewelery', 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png', 695.00, 4.6, 400),
    (6,  'Solid Gold Petite Micropave', 'jewelery', 'Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez', 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png', 168.00, 3.9, 70),
    (7,  'White Gold Plated Princess', 'jewelery', 'Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love', 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png', 9.99, 3.0, 400),
    (8,  'Pierced Owl Rose Gold Plated Stainless Steel Double', 'jewelery', 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel', 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png', 10.99, 1.9, 100),
    (9,  'WD 2TB Elements Portable External Hard Drive - USB 3.0', 'electronics', 'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity;', 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png', 64.00, 3.3, 203),
    (10, 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 'electronics', 'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM', 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png', 109.00, 2.9, 470),
    (11, 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA', 'electronics', '3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable', 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png', 109.00, 4.8, 319),
    (12, 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard', 'electronics', 'Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high', 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png', 114.00, 4.8, 400),
    (13, 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin', 'electronics', '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No', 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png', 599.00, 2.9, 250),
    (14, 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) –', 'electronics', '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM', 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png', 999.99, 2.2, 140),
    (15, 'BIYLACLESEN Women''s 3-in-1 Snowboard Jacket Winter Coats', 'women''s clothing', 'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100%', 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', 56.99, 2.6, 235),
    (16, 'Lock and Love Women''s Removable Hooded Faux Leather Moto Biker Jacket', 'women''s clothing', '100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather', 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png', 29.95, 2.9, 340),
    (17, 'Rain Jacket Women Windbreaker Striped Climbing Raincoats', 'women''s clothing', 'Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist', 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png', 39.99, 3.8, 679),
    (18, 'MBJ Women''s Solid Short Sleeve Boat Neck V', 'women''s clothing', '95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', 9.85, 4.7, 130),
    (19, 'Opna Women''s Short Sleeve Moisture', 'women''s clothing', '100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a', 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png', 7.95, 4.5, 146),
    (20, 'DANVOUY Womens T Shirt Casual Cotton Short', 'women''s clothing', '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric', 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png', 12.99, 3.6, 145);
