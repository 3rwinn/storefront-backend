# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index /products [GET]
- Show /products/:id [GET]
- Create /products [POST] [token required]

 
#### Users
- Index /users [GET] [token required]
- Show /users/:id [GET] [token required]
- Create /users [POST] [token required]

#### Orders
- Index `/orders` [GET] [token required]
- Show `/orders/:id` [GET] [token required]
- Create `/orders` [POST] [token required]
- Update `/orders/:id` [PUT] [token required]
- Delete `/orders/:id` [DELETE] [token required]
- Add product on orders `/orders/:id/products` [POST] [token required]
- Current Order by user `/orders/users/:id` [GET] [token required]

## Database Schema
#### Product table
- id `SERIAL PRIMARY KEY`
- name `VARCHAR`
- price `INTEGER`

#### User table
- id `SERIAL PRIMARY KEY`
- firstName `VARCHAR`
- lastName `VARCHAR`
- password `VARCHAR`

#### Orders table
- id `SERIAL PRIMARY KEY`
- user_id `INTEGER` `REFERENCES users(id)`
- status of order `VARCHAR`

#### Order_products table
- order_id `INTEGER` `references orders(id)`
- product_id `INTEGER` `references products(id)`
- quantity `INTEGER`

