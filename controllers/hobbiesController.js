const db = require('../database/db');

const getAllHobbies = (req, res) => {
  const sql = "SELECT * FROM Hobbies";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching hobbies:", err);
      return res.status(500).json({ error: "Failed to fetch hobbies" });
    }
    res.json(result);
  });
};

const getHobbie = (req, res) => {
  const hobbieId = req.params.id;
  const sql = "SELECT * FROM Hobbies WHERE id = ?";
  db.query(sql, [hobbieId], (err, result) => {
    if (err) {
      console.error("Error fetching hobbie:", err);
      return res.status(500).json({ error: "Failed to fetch hobbie" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Hobbie not found" });
    }
    res.json(result[0]);
  });
};

const createHobbie = (req, res) => {
  const { name, description, category, image_url } = req.body;

  if (!name || !description || !category || !image_url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO Hobbies (name, description, category, image_url) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, description, category, image_url], (err, result) => {
    if (err) {
      console.error("Error creating hobbie:", err);
      return res.status(500).json({ error: "Failed to create hobbie" });
    }
    res.status(201).json({ id: result.insertId, message: "Hobbie created successfully" });
  });
};

const updateHobbie = (req, res) => {
  const hobbieId = req.params.id;
  const { name, description, category, image_url } = req.body;

  if (!name || !description || !category || !image_url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "UPDATE Hobbies SET name = ?, description = ?, category = ?, image_url = ? WHERE id = ?";
  db.query(sql, [name, description, category, image_url, hobbieId], (err, result) => {
    if (err) {
      console.error("Error updating hobbie:", err);
      return res.status(500).json({ error: "Failed to update hobbie" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hobbie not found" });
    }
    res.json({ message: "Hobbie updated successfully" });
  });
};

const deleteHobbie = (req, res) => {
  const hobbieId = req.params.id;
  const sql = "DELETE FROM Hobbies WHERE id = ?";
  db.query(sql, [hobbieId], (err, result) => {
    if (err) {
      console.error("Error deleting hobbie:", err);
      return res.status(500).json({ error: "Failed to delete hobbie" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hobbie not found" });
    }
    res.json({ message: "Hobbie deleted successfully" });
  });
};

module.exports = {
  getAllHobbies,
  getHobbie,
  createHobbie,
  updateHobbie,
  deleteHobbie,
};
