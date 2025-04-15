const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

const register = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const checkQuery = 'SELECT * FROM Users WHERE username = $1 OR email = $2';
        const checkResult = await db.query(checkQuery, [username, email]);
        
        if (checkResult.rows.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Hash password and create user
        const hashedPassword = bcrypt.hashSync(password, 10);
        const insertQuery = 'INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
        const insertResult = await db.query(insertQuery, [username, email, hashedPassword]);
        
        const userId = insertResult.rows[0].id;
        const token = jwt.sign({ userId: userId, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ message: 'User registered successfully', userId: userId, token: token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Error registering user', error: err });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'SELECT * FROM Users WHERE username = $1';
        const result = await db.query(query, [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token: token, userId: user.id });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Error during login', error: err });
    }
};

const profile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = 'SELECT id, username, email FROM Users WHERE id = $1';
        const result = await db.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Profile retrieval error:', err);
        res.status(500).json({ message: 'Error retrieving profile', error: err });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        // Check if username or email already exists for other users
        const checkQuery = 'SELECT * FROM Users WHERE (username = $1 OR email = $2) AND id != $3';
        const checkResult = await db.query(checkQuery, [username, email, userId]);
        
        if (checkResult.rows.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Update user profile
        const updateQuery = 'UPDATE Users SET username = $1, email = $2 WHERE id = $3';
        await db.query(updateQuery, [username, email, userId]);
        
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Error updating profile', error: err });
    }
};

module.exports = {
    register,
    login,
    profile,
    updateProfile
};
