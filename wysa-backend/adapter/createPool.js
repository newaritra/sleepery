const MySQL = require("mysql2");

const Pool = MySQL.createPool({
  host: "localhost",
  user: "sleepery",
  password: "password",
  database: "sleepery", //schema name is added
  //   waitForConnections: true,
  //   charset: "utf8mb4",
});

module.exports = Pool;
