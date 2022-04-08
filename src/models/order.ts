import client from "../database";

type Order = {
  id?: number;
  user_id: number;
  status?: string;
};

type OrderProducts = {
  id?: number;
  user_id: number;
  status?: string;
  products: any[];
};

type OrderProduct = {
  order_id?: number;
  product_id: number;
  quantity: number;
};

class OrderStore {
  async index(): Promise<OrderProducts[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const { rows } = await conn.query(sql);
      const orders = [];
      const productsByOrderSql =
        "SELECT products.id, products.name, products.price, order_products.quantity FROM products JOIN order_products ON products.id = order_products.product_id WHERE order_products.order_id=($1)";
      for (const order of rows) {
        const products = await conn.query(productsByOrderSql, [order.id]);
        order.products = products.rows;
        orders.push(order);
      }
      conn.release();
      return orders;
    } catch (error) {
      throw new Error(`Cannot get orders: ${error}`);
    }
  }
  async show(id: number): Promise<OrderProducts> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      const productsByOrderSql =
        "SELECT products.id, products.name, products.price, order_products.quantity FROM products JOIN order_products ON products.id = order_products.product_id WHERE order_products.order_id=($1)";
      const products = await conn.query(productsByOrderSql, [id]);
      order.products = products.rows;

      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Cannot find order ${id}: ${error}`);
    }
  }
  async create(order: Order): Promise<Order> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        "INSERT INTO orders(user_id, status) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [order.user_id, "active"]);
      const orderAdded = result.rows[0];
      conn.release();
      return orderAdded;
    } catch (error) {
      throw new Error(`Cannot create order: ${error}`);
    }
  }
  async update(id: number, status: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "UPDATE orders SET status=$2 WHERE id=$1 RETURNING *";
      const result = await conn.query(sql, [id, status]);
      const orderUpdated = result.rows[0];
      conn.release();
      return orderUpdated;
    } catch (error) {
      throw new Error(`Cannot update order ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      const orderDeleted = result.rows[0];
      conn.release();
      return orderDeleted;
    } catch (error) {
      throw new Error(`Cannot delete order ${id}: ${error}`);
    }
  }

  async addProduct(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderProduct> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO order_products(order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot add product to order ${orderId}: ${error}`);
    }
  }

  async ordersByUser(userId: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1)";
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get orders by user ${userId}: ${error}`);
    }
  }
}

export { Order, OrderProduct, OrderStore };
