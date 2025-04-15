const db = require('../database/db');

const createResult = (req, res) => {
  const { userId, quizId, score } = req.body;
  if (!userId || !quizId || !score) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)';
  db.query(sql, [userId, quizId, score], (err, result) => {
    if (err) {
      console.error('Error creating result:', err);
      return res.status(500).json({ error: 'Failed to create result' });
    }
    res.status(201).json({ id: result.insertId, userId, quizId, score });
  });
};

const getResults = (req, res) => {
  const sql = 'SELECT * FROM results';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching results:', err);
      return res.status(500).json({ error: 'Failed to fetch results' });
    }
    res.status(200).json(results);
  });
};

const getResultById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM results WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching result:', err);
      return res.status(500).json({ error: 'Failed to fetch result' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.status(200).json(result[0]);
  });
};

const updateResult = (req, res) => {
  const { id } = req.params;
  const { userId, quizId, score } = req.body;

  if (!userId || !quizId || !score) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let sql = 'SELECT * FROM results WHERE id = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Error fetching result:', err);
          return res.status(500).json({ error: 'Failed to fetch result' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: 'Result not found' });
      }

      sql = 'UPDATE results SET user_id = ?, quiz_id = ?, score = ? WHERE id = ?';
      db.query(sql, [userId, quizId, score, id], (err) => {
          if (err) {
              console.error('Error updating result:', err);
              return res.status(500).json({ error: 'Failed to update result' });
          }
          res.status(200).json({ id: parseInt(id), userId, quizId, score });
      });
  });
};

const deleteResult = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM results WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting result:', err);
      return res.status(500).json({ error: 'Failed to delete result' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.status(200).json({ message: 'Result deleted successfully' });
  });
};

const getResultsByUserId = (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM results WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching results for user:', err);
      return res.status(500).json({ error: 'Failed to fetch results for user' });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
  getResultsByUserId,
};
