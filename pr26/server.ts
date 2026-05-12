import pkg from 'pg';
import { dbConfig } from './config';
const {Pool} = pkg;

const pool = new Pool({
    user: dbConfig.user,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database_name
})

export const db = {
    findBookByID: async (id: Number) => {
        const result = await pool.query(
            `SELECT * FROM Books where id=$1`,
            [id]
        )
        return result.rows[0]
    },
    findAuthorByID: async (id: Number) => {
        const result = await pool.query(
            `SELECT * FROM Authors where id=$1`,
            [id]
        )
        return result.rows[0]
    }

}