import client from "../database";
import bcrypt from "bcrypt";

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id?: number;
  username: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";
      //@ts-ignoreX$
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`unable show user ${id}: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *";

      // @ts-ignore
      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));

      const result = await conn.query(sql, [u.username, hash]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.username}): ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM users WHERE id=($1)";

      await conn.query(sql, [id]);

      conn.release();

      return true;
    } catch (err) {
      throw new Error(`unable delete user (${id}): ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    const sql = "SELECT password_digest FROM users WHERE username=($1)";

    const result = await conn.query(sql, [username]);

    // console.log(password + pepper);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      console.log(user);

      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user;
      }
    }

    return null;
  }
}
