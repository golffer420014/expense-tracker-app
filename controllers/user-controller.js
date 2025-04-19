const Schema = require('../lib/db');
const argon2 = require('argon2');

const userSchema = new Schema('users');

const register = async (req, res) => {
    try {
        const { username, name, password } = req.body;

        if (!username || !name || !password) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const user = await userSchema.find(`WHERE username = '${username.toLowerCase()}'`);
        if (user) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const password_hash = await argon2.hash(password)

        const newUser = await userSchema.insert({
            username: username.toLowerCase(),
            name,
            password_hash
        });

        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    register
}