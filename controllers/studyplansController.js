const db = require('../database/db');

const getStudyPlans = (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT * FROM study_plans WHERE user_id = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error getting study plans:', err);
            return res.status(500).json({ error: 'Failed to retrieve study plans' });
        }
        res.status(200).json(results);
    });
};

const createStudyPlan = (req, res) => {
    const userId = req.user.id;
    const { title, description, start_date, end_date, tasks } = req.body;

    if (!title || !description || !start_date || !end_date || !tasks) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = 'INSERT INTO study_plans (user_id, title, description, start_date, end_date, tasks) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [userId, title, description, start_date, end_date, JSON.stringify(tasks)], (err, result) => {
        if (err) {
            console.error('Error creating study plan:', err);
            return res.status(500).json({ error: 'Failed to create study plan' });
        }
        const newStudyPlanId = result.insertId;
        res.status(201).json({ id: newStudyPlanId, message: 'Study plan created successfully' });
    });
};

const getStudyPlanById = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const sql = 'SELECT * FROM study_plans WHERE id = ? AND user_id = ?';

    db.query(sql, [id, userId], (err, results) => {
        if (err) {
            console.error('Error getting study plan:', err);
            return res.status(500).json({ error: 'Failed to retrieve study plan' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Study plan not found' });
        }
        res.status(200).json(results[0]);
    });
};

const updateStudyPlan = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, start_date, end_date, tasks } = req.body;

    if (!title || !description || !start_date || !end_date || !tasks) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = 'UPDATE study_plans SET title = ?, description = ?, start_date = ?, end_date = ?, tasks = ? WHERE id = ? AND user_id = ?';

    db.query(sql, [title, description, start_date, end_date, JSON.stringify(tasks), id, userId], (err, result) => {
        if (err) {
            console.error('Error updating study plan:', err);
            return res.status(500).json({ error: 'Failed to update study plan' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Study plan not found or not authorized to update' });
        }
        res.status(200).json({ message: 'Study plan updated successfully' });
    });
};

const deleteStudyPlan = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const sql = 'DELETE FROM study_plans WHERE id = ? AND user_id = ?';

    db.query(sql, [id, userId], (err, result) => {
        if (err) {
            console.error('Error deleting study plan:', err);
            return res.status(500).json({ error: 'Failed to delete study plan' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Study plan not found or not authorized to delete' });
        }
        res.status(200).json({ message: 'Study plan deleted successfully' });
    });
};

module.exports = {
    getStudyPlans,
    createStudyPlan,
    getStudyPlanById,
    updateStudyPlan,
    deleteStudyPlan
};
