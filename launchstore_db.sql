CREATE DATABASE launchstore;

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL,
  "product_id" int
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("products_id") REFERENCES "products" ("id");

INSERT INTO categories (name) values ('Eletrônicos');
INSERT INTO categories (name) values ('Roupas');

INSERT INTO products (
  category_id,
  user_id,
  name,
  description,
  old_price,
  price,
  quantity,
  status
) values (
  1,
  1,
  'MacBook Air 2017',
  'Processador: Core i5</br>
  Memória RAM: 8 GB</br>
  Armazenamento SSD: 128 GB',
  399900,
  350000,
  5,
  1);

INSERT INTO files (name, path, product_id) 
values (
  '1595353298714-macbook-air-mqd32ll-i5-18ghz-8gb-ram-128gb-ssd-133-2017.jpg',
  'public/images/1595353298714-macbook-air-mqd32ll-i5-18ghz-8gb-ram-128gb-ssd-133-2017.jpg',
  2);

INSERT INTO files (name, path, product_id) 
values (
  '1595353298716-8db097209c.jpg',
  'public/images/1595353298716-8db097209c.jpg',
  2);

INSERT INTO files (name, path, product_id) 
values (
  '1595353298717-0594e150b1.jpg',
  'public/images/1595353298717-0594e150b1.jpg',
  2);

INSERT INTO files (name, path, product_id) 
values (
  '1595353298719-macbook-air.png',
  'public/images/1595353298719-macbook-air.png',
  2);

