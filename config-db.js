const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "123456",
  database: "class-group",
  host: "45.119.212.77",
  port: 5001,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

module.exports = pool;
