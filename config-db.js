const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "123456",
  database: process.env.PGDATABASE || "postgres",
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

module.exports = pool;
