const db = require('../database/db');

const addNotification = (req, res) => {
    const { userId, type, content, isRead = false } = req.body;
    if (!userId || !type || !content) {
        return res.status(400).json({ message: 'User ID, type, and content are required' });
    }

    const sql = 'INSERT INTO Notifications (user_id, type, content, is_read, created_at) VALUES (?, ?, ?, ?, NOW())';

    db.query(sql, [userId, type, content, isRead], (err, result) => {
        if (err) {
            console.error("Error creating notification:", err);
            return res.status(500).json({ message: 'Failed to create notification', error: err.message });
        }

        const newNotificationId = result.insertId;
        res.status(201).json({ id: newNotificationId, message: 'Notification created successfully' });
    });
};

const getAllNotifications = (req, res) => {
    const sql = 'SELECT * FROM Notifications';

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ message: 'Failed to retrieve notifications', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(results);
    });
};

const getNotificationById = (req, res) => {
    const notificationId = req.params.id;

    if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    const sql = 'SELECT * FROM Notifications WHERE id = ?';

    db.query(sql, [notificationId], (err, results) => {
        if (err) {
            console.error("Error fetching notification:", err);
            return res.status(500).json({ message: 'Failed to retrieve notification', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(results[0]);
    });
};

const getUserNotifications = (req, res) => {
  const userId = req.user.userId;
  const sql = 'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC';

  db.query(sql, [userId])
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch(err => {
      console.error("Error fetching notifications:", err);
      res.status(500).json({
        message: 'Failed to retrieve notifications',
        error: err.message
      });
    });
};

const markAsRead = (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const sql = 'UPDATE Notifications SET is_read = true WHERE id = ? AND user_id = ?';

  db.query(sql, [id, userId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Notification not found or unauthorized' });
      }
      res.status(200).json({ message: 'Notification marked as read' });
    })
    .catch(err => {
      console.error("Error marking notification as read:", err);
      res.status(500).json({
        message: 'Failed to mark notification as read',
        error: err.message
      });
    });
};

const createNotification = async (userId, title, message, type = 'info') => {
  const sql = 'INSERT INTO Notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)';
  
  try {
    const [result] = await db.query(sql, [userId, title, message, type]);
    return result.insertId;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
};

const deleteNotification = (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const sql = 'DELETE FROM Notifications WHERE id = ? AND user_id = ?';

  db.query(sql, [id, userId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Notification not found or unauthorized' });
      }
      res.status(200).json({ message: 'Notification deleted successfully' });
    })
    .catch(err => {
      console.error("Error deleting notification:", err);
      res.status(500).json({
        message: 'Failed to delete notification',
        error: err.message
      });
    });
};

module.exports = {
    addNotification,
    getAllNotifications,
    getNotificationById,
    getUserNotifications,
    markAsRead,
    createNotification,
    deleteNotification,
};
