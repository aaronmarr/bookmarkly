import pg from 'pg';
const { Pool } = pg;

export default async function query(text, params = []) {
  const pool = new Pool();
  const results = await pool.query(text, params);
  const rows = results.rows;

  pool.end();

  return rows;
}
