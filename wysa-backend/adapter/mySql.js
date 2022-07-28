const Pool = require("./createPool");

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    console.log(query);
    Pool.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = runQuery;
