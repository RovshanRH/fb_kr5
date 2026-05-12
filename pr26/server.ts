import pkg from "pg";
import { dbConfig } from "./config";
const { Pool } = pkg;

const pool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database_name,
});

export const db = {
  findBookByID: async (id: Number) => {
    const result = await pool.query(`SELECT * FROM Books where id=$1`, [id]);
    return result.rows[0];
  },
  findBooks: async () => {
    const result = await pool.query(`SELECT * FROM Books`);
    return result.rows;
  },
  findAuthorByID: async (id: Number) => {
    const result = await pool.query(`SELECT * FROM Authors where id=$1`, [id]);
    return result.rows[0];
  },
  findAuthors: async () => {
    const result = await pool.query(`SELECT * FROM Authors`);
    return result.rows;
  },
  findBooksByAuthorID: async (authorId: Number) => {
    const result = await pool.query(`SELECT * FROM Books where author_id=$1`, [
      authorId,
    ]);
    return result.rows;
  },
};
