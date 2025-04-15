const db = require('../database/db');

const getAllLanguages = (req, res) => {
  const sql = 'SELECT * FROM languages';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving languages:", err);
      return res.status(500).json({ error: "Failed to retrieve languages" });
    }
    res.json(result);
  });
};

const getLanguageById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM languages WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error retrieving language:", err);
      return res.status(500).json({ error: "Failed to retrieve language" });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Language not found" });
    }

    res.json(result[0]);
  });
};

const createLanguage = (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: "Name and code are required" });
  }
  
  const sql = 'INSERT INTO languages (name, code) VALUES (?, ?)';

  db.query(sql, [name, code], (err, result) => {
    if (err) {
      console.error("Error creating language:", err);
      return res.status(500).json({ error: "Failed to create language" });
    }
    
    const newLanguageId = result.insertId;
    res.status(201).json({ id: newLanguageId, message: "Language created successfully" });
  });
};

const updateLanguage = (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: "Name and code are required" });
  }
  
  const checkSql = 'SELECT * FROM languages WHERE id = ?';
  db.query(checkSql, [id], (err, result) => {
    if (err) {
      console.error("Error checking language:", err);
      return res.status(500).json({ error: "Failed to check language" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Language not found" });
      }
      
      const updateSql = 'UPDATE languages SET name = ?, code = ? WHERE id = ?';
      db.query(updateSql, [name, code, id], (err, result) => {
        if (err) {
          console.error("Error updating language:", err);
        return res.status(500).json({ error: "Failed to update language" });
      }

      res.json({ message: "Language updated successfully" });
    });
  });
};

const deleteLanguage = (req, res) => {
  const { id } = req.params;
  
  const checkSql = 'SELECT * FROM languages WHERE id = ?';
  db.query(checkSql, [id], (err, result) => {
    if (err) {
      console.error("Error checking language:", err);
      return res.status(500).json({ error: "Failed to check language" });
    }

    if (result.length === 0) {
        return res.status(404).json({ message: "Language not found" });
      }
      
      const deleteSql = 'DELETE FROM languages WHERE id = ?';
      db.query(deleteSql, [id], (err, result) => {
        if (err) {
          console.error("Error deleting language:", err);
          return res.status(500).json({ error: "Failed to delete language" });
        }
        
        res.json({ message: "Language deleted successfully" });
    });
  });
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
