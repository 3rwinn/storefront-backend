import client from "../database";

type Order = {
  id?: number;
  user_id: number;
  status?: string;
};

type OrderBook = {
  id?: number;
  order_id: number;
  product_id: number;
};

class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get orders: ${error}`);
    }
  }
  async show(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
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
      const result = await conn.query(sql, [order.user_id, "pending"]);
      const orderAdded = result.rows[0];
      conn.release();
      return orderAdded;
    } catch (error) {
      throw new Error(`Cannot create order: ${error}`);
    }
  }
  async update(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql =
        "UPDATE orders SET user_id=($2), status=($3), WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [
        order.id,
        order.user_id,
        order.status,
      ]);
      const orderUpdated = result.rows[0];
      conn.release();
      return orderUpdated;
    } catch (error) {
      throw new Error(`Cannot update order ${order.id}: ${error}`);
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

  async addBook(
    orderId: number,
    bookId: number,
    quantity: number
  ): Promise<OrderBook> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO orders_books(order_id, book_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [orderId, bookId, quantity]);
      const orderBookAdded = result.rows[0];
      conn.release();
      return orderBookAdded;
    } catch (error) {
      throw new Error(`Cannot add book to order ${orderId}: ${error}`);
    }
  }
}

export { Order, OrderBook, OrderStore };
