const db = require('../database/db');

const getAllHobbies = async (req, res) => {
    try {
        const query = 'SELECT * FROM Hobbies ORDER BY name';
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching hobbies:', err);
        res.status(500).json({ message: 'Error fetching hobbies', error: err });
    }
};

const getHobbyById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM Hobbies WHERE id = $1';
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hobby not found' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching hobby:', err);
        res.status(500).json({ message: 'Error fetching hobby', error: err });
    }
};

const createHobby = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const query = 'INSERT INTO Hobbies (name, description) VALUES ($1, $2) RETURNING *';
        const result = await db.query(query, [name, description]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating hobby:', err);
        res.status(500).json({ message: 'Error creating hobby', error: err });
    }
};

const updateHobby = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const query = 'UPDATE Hobbies SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
        const result = await db.query(query, [name, description, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hobby not found' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating hobby:', err);
        res.status(500).json({ message: 'Error updating hobby', error: err });
    }
};

const deleteHobby = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM Hobbies WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hobby not found' });
        }
        
        res.status(200).json({ message: 'Hobby deleted successfully' });
    } catch (err) {
        console.error('Error deleting hobby:', err);
        res.status(500).json({ message: 'Error deleting hobby', error: err });
    }
};

module.exports = {
    getAllHobbies,
    getHobbyById,
    createHobby,
    updateHobby,
    deleteHobby
};
