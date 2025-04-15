const db = require('../database/db');

const addMessage = (req, res) => {
  const { senderId, receiverId, content, timestamp } = req.body;
  const sql = 'INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, ?)';
  db.query(sql, [senderId, receiverId, content, timestamp], (err, result) => {
    if (err) {
      console.error("Error adding message:", err);
      return res.status(500).json({ error: 'Failed to add message' });
    }
    res.status(201).json({ id: result.insertId, senderId, receiverId, content, timestamp });
  });
};

const getAllMessages = (req, res) => {
  const sql = 'SELECT * FROM messages';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.status(200).json(results);
  });
};

const getMessageById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM messages WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching message:", err);
      return res.status(500).json({ error: 'Failed to fetch message' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(results[0]);
  });
};

const deleteMessage = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM messages WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({ error: 'Failed to delete message' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  });
};

const getMessagesBetweenUsers = (req, res) => {
    const { userId1, userId2 } = req.params;
    const sql = `
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `;
    db.query(sql, [userId1, userId2, userId2, userId1], (err, results) => {
      if (err) {
        console.error("Error fetching messages between users:", err);
        return res.status(500).json({ error: 'Failed to fetch messages between users' });
      }
      res.status(200).json(results);
    });
  };
  

module.exports = {
  addMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
  getMessagesBetweenUsers
};
