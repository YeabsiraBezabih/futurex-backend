const db = require('../database/db');

const getAllLanguages = (req, res) => {
  const sql = 'SELECT * FROM Languages';
  
  db.query(sql)
    .then(([results]) => {
      res.json(results);
    })
    .catch(err => {
      console.error("Error retrieving languages:", err);
      res.status(500).json({ error: "Failed to retrieve languages" });
    });
};

const getLanguageById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Languages WHERE id = ?';

  db.query(sql, [id])
    .then(([results]) => {
      if (results.length === 0) {
        return res.status(404).json({ message: 'Language not found' });
      }
      res.json(results[0]);
    })
    .catch(err => {
      console.error("Error retrieving language:", err);
      res.status(500).json({ error: "Failed to retrieve language" });
    });
};

const createLanguage = (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: "Name and code are required" });
  }

  const sql = 'INSERT INTO Languages (name, code) VALUES (?, ?)';

  db.query(sql, [name, code])
    .then(([result]) => {
      res.status(201).json({
        id: result.insertId,
        message: 'Language created successfully'
      });
    })
    .catch(err => {
      console.error("Error creating language:", err);
      res.status(500).json({
        error: 'Failed to create language',
        details: err.message
      });
    });
};

const updateLanguage = (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: "Name and code are required" });
  }

  const checkSql = 'SELECT * FROM Languages WHERE id = ?';
  
  db.query(checkSql, [id])
    .then(([results]) => {
      if (results.length === 0) {
        return res.status(404).json({ message: 'Language not found' });
      }

      const updateSql = 'UPDATE Languages SET name = ?, code = ? WHERE id = ?';
      return db.query(updateSql, [name, code, id]);
    })
    .then(() => {
      res.json({ message: 'Language updated successfully' });
    })
    .catch(err => {
      console.error('Error updating language:', err);
      res.status(500).json({
        error: 'Failed to update language',
        details: err.message
      });
    });
};

const deleteLanguage = (req, res) => {
  const { id } = req.params;

  const checkSql = 'SELECT * FROM Languages WHERE id = ?';
  
  db.query(checkSql, [id])
    .then(([results]) => {
      if (results.length === 0) {
        return res.status(404).json({ message: 'Language not found' });
      }

      const deleteSql = 'DELETE FROM Languages WHERE id = ?';
      return db.query(deleteSql, [id]);
    })
    .then(() => {
      res.json({ message: 'Language deleted successfully' });
    })
    .catch(err => {
      console.error('Error deleting language:', err);
      res.status(500).json({ error: 'Failed to delete language' });
    });
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage
};
