const Schema = require('../lib/db');

const categorySchema = new Schema('categories');
const userSchema = new Schema('users');

const create = async (req, res) => {
    try {
        const { name, type, user_id } = req.body;
        // const user_id = req.user?.id;

        if (!name || !type) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'Invalid category type. Must be either income or expense.' });
        }

        const user = await userSchema.findOne(`WHERE id = '${user_id}'`);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newCategory = await categorySchema.insert({
            user_id,
            name,
            type
        });

        res.status(201).json({ message: 'Category created', category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAll = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const query = user_id
            ? `WHERE user_id = '${user_id}'`
            : `WHERE user_id IS NULL`;
        const categories = await categorySchema.find(query);
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getById = async (req, res) => {
    try {
        // ยังไม่ได้เทส
        const { id } = req.params;
        const user_id = req.user?.id;

        const category = await categorySchema.findOne(`WHERE id = ${id} AND (user_id IS NULL OR user_id = '${user_id}')`);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error getting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, user_id } = req.body;
        // const user_id = req.user?.id;

        const user = await userSchema.findOne(`WHERE id = '${user_id}'`);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const category = await categorySchema.findOne(`WHERE id = ${id} AND (user_id IS NULL OR user_id = '${user_id}')`);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'Invalid category type. Must be either income or expense.' });
        }

        const updatedCategory = await categorySchema.update(
            {
                name: name || category.name,
                type: type || category.type
            },
            `id = ${id} AND (user_id IS NULL OR user_id = '${user_id}')`
        );

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;
        // const user_id = req.user?.id; // Optional chaining to handle undefined user

        const user = await userSchema.findOne(`WHERE id = '${user_id}'`);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const category = await categorySchema.findOne(`WHERE id = ${id} AND (user_id IS NULL OR user_id = '${user_id}')`);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        await categorySchema.delete(`WHERE id = ${id} AND (user_id IS NULL OR user_id = '${user_id}')`);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    create,
    getAll,
    getById,
    updateByID,
    remove
} 