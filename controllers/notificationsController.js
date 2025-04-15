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

const deleteNotification = (req, res) => {
    const notificationId = req.params.id;

    if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    const sql = 'DELETE FROM Notifications WHERE id = ?';

    db.query(sql, [notificationId], (err, result) => {
        if (err) {
            console.error("Error deleting notification:", err);
            return res.status(500).json({ message: 'Failed to delete notification', error: err.message });
        } 

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    });
};

const getNotificationsByUserId = (req, res) => {
    const userId = req.params.userId;

    const sql = 'SELECT * FROM Notifications WHERE user_id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ message: 'Failed to retrieve notifications', error: err.message });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    addNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    getNotificationsByUserId
};
