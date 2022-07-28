const jwt = require("jsonwebtoken");
const runQuery = require("../adapter/mySql");

async function isLoggedIn(req, res, next) {
  try {
    if (req.path == "/login" || req.path == "/registration") {
      return next();
    }
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    if (token == "null") {
      console.log("Toked");
      throw "Token not valid";
    }
    jwt.verify(token, "SECRET", async (err, payload) => {
      if (err) throw err;
      else {
        const { username, password } = payload;
        let queryRes = await runQuery(
          `SELECT * FROM Users WHERE username=? AND password=?`,
          [username, password]
        );
        if (!queryRes || !queryRes?.length) {
          throw "User does not exist";
        } else if (queryRes.length == 1) {
          next();
        }
      }
    });
  } catch (err) {
    console.log("Error in auth middleware", err);
    res.json({
      error: err,
      message: "User not logged in",
    });
  }
}

module.exports = { isLoggedIn };
