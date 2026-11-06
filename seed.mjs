import "dotenv/config";
import mysql from "mysql2/promise";

const usuarios = [
    { id: 1, name: "john doe", role: "ADMIN", user: "johnd", password: "m38rmF$" },
    { id: 2, name: "david morrison", role: "AUDITOR", user: "mor_2314", password: "83r5^_" },
    { id: 3, name: "kevin ryan", role: "CLIENT", user: "kevinryan", password: "kev02937@" },
    { id: 4, name: "don romer", role: "CLIENT", user: "donero", password: "ewedon" },
    { id: 5, name: "derek powell", role: "CLIENT", user: "derek", password: "jklg*_56" },
    { id: 6, name: "david russell", role: "CLIENT", user: "david_r", password: "3478*#54" },
    { id: 7, name: "miriam snyder", role: "CLIENT", user: "snyder", password: "f238&@*$" },
    { id: 8, name: "william hopkins", role: "CLIENT", user: "hopkins", password: "William56$hj" },
    { id: 9, name: "kate hale", role: "CLIENT", user: "kate_h", password: "kfejk@*_" },
    { id: 10, name: "jimmie klein", role: "CLIENT", user: "jimmie_k", password: "klein*#%*" },
];

const productos = [
    {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        category: "men's clothing",
        description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
        price: 109.95,
        rating_rate: 3.9,
        rating_count: 120,
    },
    {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts",
        category: "men's clothing",
        description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft",
        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
        price: 22.3,
        rating_rate: 4.1,
        rating_count: 259,
    },
    {
        id: 3,
        title: "Mens Cotton Jacket",
        category: "men's clothing",
        description: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working,",
        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
        price: 55.99,
        rating_rate: 4.7,
        rating_count: 500,
    },
    {
        id: 4,
        title: "Mens Casual Slim Fit",
        category: "men's clothing",
        description: "The color could be slightly different between on the screen and in practice. / Please note that",
        image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
        price: 15.99,
        rating_rate: 2.1,
        rating_count: 430,
    },
    {
        id: 5,
        title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain",
        category: "jewelery",
        description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the",
        image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
        price: 695,
        rating_rate: 4.6,
        rating_count: 400,
    },
    {
        id: 6,
        title: "Solid Gold Petite Micropave",
        category: "jewelery",
        description: "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez",
        image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
        price: 168,
        rating_rate: 3.9,
        rating_count: 70,
    },
    {
        id: 7,
        title: "White Gold Plated Princess",
        category: "jewelery",
        description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love",
        image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
        price: 9.99,
        rating_rate: 3,
        rating_count: 400,
    },
    {
        id: 8,
        title: "Pierced Owl Rose Gold Plated Stainless Steel Double",
        category: "jewelery",
        description: "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
        image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
        price: 10.99,
        rating_rate: 1.9,
        rating_count: 100,
    },
    {
        id: 9,
        title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
        category: "electronics",
        description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity;",
        image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
        price: 64,
        rating_rate: 3.3,
        rating_count: 203,
    },
    {
        id: 10,
        title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
        category: "electronics",
        description: "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM",
        image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
        price: 109,
        rating_rate: 2.9,
        rating_count: 470,
    },
    {
        id: 11,
        title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA",
        category: "electronics",
        description: "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable",
        image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
        price: 109,
        rating_rate: 4.8,
        rating_count: 319,
    },
    {
        id: 12,
        title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard",
        category: "electronics",
        description: "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high",
        image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
        price: 114,
        rating_rate: 4.8,
        rating_count: 400,
    },
    {
        id: 13,
        title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
        category: "electronics",
        description: "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No",
        image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
        price: 599,
        rating_rate: 2.9,
        rating_count: 250,
    },
    {
        id: 14,
        title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) –",
        category: "electronics",
        description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM",
        image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
        price: 999.99,
        rating_rate: 2.2,
        rating_count: 140,
    },
    {
        id: 15,
        title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
        category: "women's clothing",
        description: "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100%",
        image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
        price: 56.99,
        rating_rate: 2.6,
        rating_count: 235,
    },
    {
        id: 16,
        title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
        category: "women's clothing",
        description: "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather",
        image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
        price: 29.95,
        rating_rate: 2.9,
        rating_count: 340,
    },
    {
        id: 17,
        title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
        category: "women's clothing",
        description: "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist",
        image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
        price: 39.99,
        rating_rate: 3.8,
        rating_count: 679,
    },
    {
        id: 18,
        title: "MBJ Women's Solid Short Sleeve Boat Neck V",
        category: "women's clothing",
        description: "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch",
        image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
        price: 9.85,
        rating_rate: 4.7,
        rating_count: 130,
    },
    {
        id: 19,
        title: "Opna Women's Short Sleeve Moisture",
        category: "women's clothing",
        description: "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a",
        image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
        price: 7.95,
        rating_rate: 4.5,
        rating_count: 146,
    },
    {
        id: 20,
        title: "DANVOUY Womens T Shirt Casual Cotton Short",
        category: "women's clothing",
        description: "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric",
        image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
        price: 12.99,
        rating_rate: 3.6,
        rating_count: 145,
    },
];

const crearTablas = [
    `CREATE TABLE IF NOT EXISTS users (
        id       INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        name     VARCHAR(50) NOT NULL,
        role     ENUM('ADMIN','AUDITOR','CLIENT') NOT NULL DEFAULT 'CLIENT',
        user     VARCHAR(30) NOT NULL,
        password VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS products (
        id           INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        title        VARCHAR(70) NOT NULL,
        category     VARCHAR(50) NOT NULL,
        description  VARCHAR(100) NOT NULL,
        image        VARCHAR(200) NOT NULL,
        price        DECIMAL(10, 4) NOT NULL,
        rating_rate  DECIMAL(3, 1) NOT NULL,
        rating_count INT NOT NULL
    ) ENGINE=InnoDB`,
];

async function main() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 4000),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: {},
        enableKeepAlive: true,
        connectionLimit: 4,
    });

    try {
        for (const sql of crearTablas) {
            await pool.query(sql);
        }

        await pool.query("ALTER TABLE products MODIFY rating_rate DECIMAL(3, 1) NOT NULL");

        for (const u of usuarios) {
            await pool.execute(
                `INSERT INTO users (id, name, role, \`user\`, password)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    role = VALUES(role),
                    \`user\` = VALUES(\`user\`),
                    password = VALUES(password)`,
                [u.id, u.name, u.role, u.user, u.password]
            );
        }

        for (const p of productos) {
            await pool.execute(
                `INSERT INTO products
                    (id, title, category, description, image, price, rating_rate, rating_count)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    title = VALUES(title),
                    category = VALUES(category),
                    description = VALUES(description),
                    image = VALUES(image),
                    price = VALUES(price),
                    rating_rate = VALUES(rating_rate),
                    rating_count = VALUES(rating_count)`,
                [p.id, p.title, p.category, p.description, p.image, p.price, p.rating_rate, p.rating_count]
            );
        }

        const [[users]] = await pool.query("SELECT COUNT(*) AS total FROM users");
        const [[products]] = await pool.query("SELECT COUNT(*) AS total FROM products");

        console.log(`Usuarios cargados: ${users.total}`);
        console.log(`Productos cargados: ${products.total}`);
    }
    finally {
        await pool.end();
    }
}

main().catch((error) => {
    console.error("No se pudieron cargar los datos:", error.message);
    process.exit(1);
});
