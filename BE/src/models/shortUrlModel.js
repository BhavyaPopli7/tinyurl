const { pool } = require('../config/db');

async function createShortUrl(code, originalUrl) {
  const query = `
    INSERT INTO short_urls (code, original_url)
    VALUES ($1, $2)
    RETURNING id, code, original_url, created_at;
  `;
  const values = [code, originalUrl];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByCode(code) {
  const query = `
    SELECT id, code, original_url, created_at
    FROM short_urls
    WHERE code = $1
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [code]);
  return rows[0] || null;
}

module.exports = {
  createShortUrl,
  findByCode,
};
