const jwt = require('jsonwebtoken');
const db = require('../database/db');

const register = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'SELECT * FROM Users WHERE username = ? OR email = ?';
    db.query(query, [username, email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking user', error: err });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password', error: err });
            }
            const insertQuery = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user', error: err });
                }
                const userId = results.insertId;
                const token = jwt.sign({ userId: userId, username: username }, 'your_jwt_secret', { expiresIn: '1h' });
                res.status(201).json({ message: 'User registered successfully', userId: userId, token: token });
            });
        });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'SELECT * FROM Users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking user', error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords', error: err });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const token = jwt.sign({ userId: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token: token, userId: user.id });
        });
    });
};

const profile = (req, res) => {
    const userId = req.user.userId;
    const query = 'SELECT id, username, email, bio, profile_picture FROM Users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving profile', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(results[0]);
    });
};
const updateProfile = (req, res) => {
    const userId = req.user.userId;
    const { username, email, bio, profile_picture } = req.body;

    //check if all required fields are present
    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
    }

    //check if the username or email already exists for another user
    const checkUserQuery = 'SELECT * FROM Users WHERE (username = ? OR email = ?) AND id != ?';
    db.query(checkUserQuery, [username, email, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking user', error: err });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        let updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (bio) updateFields.bio = bio;
        if (profile_picture) updateFields.profile_picture = profile_picture;

        let updateQuery = 'UPDATE Users SET ';
        const values = [];
        for (const key in updateFields) {
            updateQuery += `${key} = ?, `;
            values.push(updateFields[key]);
        }
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        values.push(userId);

        db.query(updateQuery, values, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating profile', error: err });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        });
    });
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: newuser
 *               email: newuser@example.com
 *               password: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required
 *       409:
 *         description: Username or email already exists
 *       500:
 *         description: Error registering user
 */
module.exports = {
    register,
    login,
    profile,
    updateProfile,
};
