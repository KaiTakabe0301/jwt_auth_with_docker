import { Router } from 'express';
import pool from '../../db/pool.js';

const router = Router();

export default (app) => {
  app.use('/users', router);
  /* GET users listing. */
  // ユーザ一覧
  router.get("/", (req, res, next) => {
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
}
