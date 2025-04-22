const Schema = require('../lib/db');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const userSchema = new Schema('users');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;


        if (!username || !password) {
            return res.status(400).json({ message: 'Missing username or password' });
        }

        const user = await userSchema.findOne(`WHERE username = '${username.toLowerCase()}'`);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await argon2.verify(user.password_hash, password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.id,
                username: user.username,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password_hash from response
        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json({
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const me = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userSchema.findOne(`WHERE id = '${decoded.id}'`);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password_hash from response
        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login,
    me
}; 