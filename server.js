const express = require("express");
const app = express();
const cors = require("cors");
const runQuery = require("./adapter/mySql");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("./middlewares");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(isLoggedIn);

app.post("/answers", async (req, res) => {
  try {
    const { response, ques_id } = req.body;
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let username, password;
    jwt.verify(token, "SECRET", (err, payload) => {
      if (err) throw err;
      else {
        username = payload.username;
        password = payload.password;
      }
    });
    const queryRes = await runQuery(`SELECT * FROM Users WHERE username=?`, [
      username,
    ]);
    if (!queryRes.length) throw "No such user";
    let user_id = queryRes[0].id;
    await runQuery(
      `INSERT INTO responses(ques_id,user_id,response) VALUES (?,?,?)`,
      [ques_id, user_id, response]
    );
    res.sendStatus(200);
    console.log(response, ques_id);
  } catch (err) {
    console.log("Error while storing answers in database\n", err);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const queryRes = await runQuery(`SELECT * FROM Users WHERE username=?`, [
      username,
    ]);
    if (queryRes.length) throw "User already exists";
    await runQuery(`INSERT INTO Users (username,password) VALUES (?,?)`, [
      username,
      password,
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.json({
      error: err,
      message: "User can't be registered",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const queryRes = await runQuery(
      `SELECT * FROM Users WHERE username=? AND password=?`,
      [username, password]
    );
    console.log(queryRes);
    if (!queryRes || !queryRes.length) throw "User can't be logged in";
    const token = jwt.sign({ username, password }, "SECRET", {
      expiresIn: "2d",
    });
    res.json({ token });
  } catch (err) {
    res.status(403).json({ error: err, message: "User can't be logged in" });
  }
});

app.listen(process.env.PORT || 3030, () => {
  console.log(`Listening on port ${process.env.PORT || 3030}`);
  console.log(isLoggedIn);
});
