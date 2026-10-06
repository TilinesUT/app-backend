
-- Antes de iniciar este proyecto ejecuta este script --
USE tilines_db;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
    id          INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    role        ENUM('ADMIN','AUDITOR','CLIENT') NOT NULL DEFAULT 'CLIENT',
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
    rating_rate     INT NOT NULL,
    rating_count    INT NOT NULL
) engine=InnoDB;