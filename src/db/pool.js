const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  // hostはコンテナ名
  host: "postgresql",
  database: "express_jwt_auth",
  password: "admin",
  port: 5432,
});

module.exports = pool;
