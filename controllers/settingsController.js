const db = require('../database/db');

const getSettings = (req, res) => {
    // Implement get settings logic here
    const userId = req.user.id; // Assuming user ID is available from the authentication middleware
    const sql = 'SELECT * FROM user_settings WHERE user_id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching settings:", err);
            return res.status(500).json({ error: "Failed to fetch settings" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Settings not found for this user" });
        }

        res.status(200).json(results[0]); 
    });
};

const updateSetting = (req, res) => {
    const userId = req.user.id;
    const { language, theme, notifications } = req.body; // Assuming these are the settings to be updated

    // Validate input data (optional, but recommended)
    if (!language || !theme || notifications === undefined) {
        return res.status(400).json({ error: "Missing required settings data" });
    }

    const sql = 'UPDATE user_settings SET language = ?, theme = ?, notifications = ? WHERE user_id = ?';
    const values = [language, theme, notifications, userId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating settings:", err);
            return res.status(500).json({ error: "Failed to update settings" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Settings not found for this user" }); // Or handle as appropriate if settings should always exist
        }

        res.status(200).json({ message: "Settings updated successfully" });
    });
};

module.exports = {
    getSettings,
    updateSetting
};
