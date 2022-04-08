import client from "../database";

type Product = {
  id?: number;
  name: string;
  price: number;
};

class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get products: ${error}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot find product ${id}: ${error}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO products(name, price) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [product.name, product.price]);
      const productAdded = result.rows[0];
      conn.release();
      return productAdded;
    } catch (error) {
      throw new Error(`Cannot create product: ${error}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      const productDeleted = result.rows[0];
      conn.release();
      return productDeleted;
    } catch (error) {
      throw new Error(`Cannot delete product ${id}: ${error}`);
    }
  }
}

export { Product, ProductStore };
