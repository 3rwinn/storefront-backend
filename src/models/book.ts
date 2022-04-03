import client from "../database";

type Book = {
  id?: number;
  title: string;
  author: string;
  total_pages: number;
  summary: string;
};

class BookStore {
  async index(): Promise<Book[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM books";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get books: ${error}`);
    }
  }

  async show(id: number): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM books WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot find book ${id}: ${error}`);
    }
  }

  async create(book: Book): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO books(title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *";
      const result = await conn.query(sql, [
        book.title,
        book.author,
        book.total_pages,
        book.summary,
      ]);
      const bookAdded = result.rows[0];
      conn.release();
      return bookAdded;
    } catch (error) {
      throw new Error(`Cannot create book: ${error}`);
    }
  }

  async update(book: Book): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql =
        "UPDATE books SET title=($2), author=($3), total_pages=($4), summary=($5) WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [
        book.id,
        book.title,
        book.author,
        book.total_pages,
        book.summary,
      ]);
      const bookUpdated = result.rows[0];
      conn.release();
      return bookUpdated;
    } catch (error) {
      throw new Error(`Cannot update book ${book.id}: ${error}`);
    }
  }

  async delete(id: number): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM books WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      const bookDeleted = result.rows[0];
      conn.release();
      return bookDeleted;
    } catch (error) {
      throw new Error(`Cannot delete book ${id}: ${error}`);
    }
  }
}

export { Book, BookStore };
