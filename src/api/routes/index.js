var express = require("express");
var router = express.Router();

const pool = require("../../db/pool");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

// ユーザ一覧
router.get("/users", (req, res, next) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    if (results) {
      return res.status(200).json({
        data: results.rows,
      });
    }
  });
});

// ユーザ登録
router.post("/auth/register", (req, res, next) => {
  const idLength = 10;
  const idSource = "abcdefghijklmnopqrstuvwxyz0123456789";

  let id = "";
  for (let i = 0; i < idLength; i++) {
    id += idSource[Math.floor(Math.random() * idSource.length)];
  }

  const { name, email, password } = req.body;
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      pool.query(
        "INSERT INTO users VALUES($1,$2,$3,$4)",
        [id, name, email, hash],
        (error, results) => {
          if (error) {
            return res.status(500).json({
              status: "500 Internal Server Error",
              error: error,
            });
          }
          if (results) {
            res.status(200).json({
              status: "success",
            });
          }
        }
      );
    });
});

router.delete("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: "500 Internal Server Error",
        error: error,
      });
    }
    if (results.rowCount === 0) {
      return res.status(400).json({
        status: "400 Bad Request",
        message: "データが存在しません",
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "データを削除しました",
      });
    }
  });
});

router.post("/auth/login", (req, res, next) => {
  const { email, password } = req.body;
  pool.query("SELECT * FROM users WHERE email = $1", [email], (error, user) => {
    if (error) {
      return res.status(400).json({
        status: "400 Bad Request",
        error: error,
      });
    }

    // emailが見つからなかった場合
    if (user.rowCount === 0) {
      return res.json({
        message: `${email}は登録されていません`,
      });
    }

    // passwordの照合
    bcrypt.compare(password, user.rows[0].password, (error, results) => {
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      if (!results) {
        return res.json({
          message: "password is not correct",
        });
      }
      const payload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      };
      const token = jwt.sign(payload, "secret");
      res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: true,
      });
      return res.json({ token });
    });
  });
});

router.get("/auth/user", (req, res) => {
  const bearToken = req.headers["authorization"];
  const bearer = bearToken.split(" ");
  const token = bearer[1];

  jwt.verify(token, "secret", (error, user) => {
    if (error) {
      return res.sendStatus(403);
    } else {
      return res.json({
        user,
      });
    }
  });
});

module.exports = router;
