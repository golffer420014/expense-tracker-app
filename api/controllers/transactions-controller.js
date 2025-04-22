const Schema = require('../lib/db');

const transactionSchema = new Schema('transactions');
const categorySchema = new Schema('categories');

const create = async (req, res) => {
    try {
        const { category_id, amount, type, description, note, is_recurring, date } = req.body;
        const user_id = req.user?.id;


        if (!amount || !type || !date) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'Invalid transaction type. Must be either income or expense.' });
        }

        // If category_id is provided, verify it exists and belongs to the user
        if (category_id) {
            const category = await categorySchema.findOne(`WHERE id = ${category_id} AND (user_id IS NULL OR user_id = '${user_id}')`);
            if (!category) {
                return res.status(404).json({ message: 'Category not found.' });
            }
        }

        const newTransaction = await transactionSchema.insert({
            user_id,
            category_id,
            amount,
            type,
            description,
            note,
            is_recurring,
            date
        });

        res.status(201).json({ message: 'Transaction created', transaction: newTransaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAll = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const { start_date, end_date, type, category_id } = req.query;

        let query = `WHERE user_id = '${user_id}'`;
        
        if (start_date) {
            query += ` AND date >= '${start_date}'`;
        }
        if (end_date) {
            query += ` AND date <= '${end_date}'`;
        }
        if (type) {
            query += ` AND type = '${type}'`;
        }
        if (category_id) {
            query += ` AND category_id = ${category_id}`;
        }

        const transactions = await transactionSchema.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;

        const transaction = await transactionSchema.findOne(`WHERE id = ${id} AND user_id = '${user_id}'`);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;
        const { category_id, amount, type, description, note, is_recurring, date } = req.body;

        const transaction = await transactionSchema.findOne(`WHERE id = ${id} AND user_id = '${user_id}'`);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'Invalid transaction type. Must be either income or expense.' });
        }

        // If category_id is provided, verify it exists and belongs to the user
        if (category_id) {
            const category = await categorySchema.findOne(`WHERE id = ${category_id} AND (user_id IS NULL OR user_id = '${user_id}')`);
            if (!category) {
                return res.status(404).json({ message: 'Category not found.' });
            }
        }

        const updatedTransaction = await transactionSchema.update(
            {
                category_id: category_id || transaction.category_id,
                amount: amount || transaction.amount,
                type: type || transaction.type,
                description: description !== undefined ? description : transaction.description,
                note: note !== undefined ? note : transaction.note,
                is_recurring: is_recurring !== undefined ? is_recurring : transaction.is_recurring,
                date: date || transaction.date
            },
            `id = ${id} AND user_id = '${user_id}'`
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;

        const transaction = await transactionSchema.findOne(`WHERE id = ${id} AND user_id = '${user_id}'`);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        await transactionSchema.delete(`WHERE id = ${id} AND user_id = '${user_id}'`);
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
} 