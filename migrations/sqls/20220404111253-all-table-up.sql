CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_digest VARCHAR NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    price integer NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(15) NOT NULL
);

CREATE TABLE order_products (
    order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity integer NOT NULL
);