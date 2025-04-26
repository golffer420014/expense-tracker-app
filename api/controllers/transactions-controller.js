const Schema = require('../lib/db');

const transactionSchema = new Schema('transactions');
const categorySchema = new Schema('categories');
const userSchema = new Schema('users');
const _vm_user_monthly_summary = new Schema('user_monthly_summary');

const create = async (req, res) => {
    try {
        const { category_id, amount, type, description, note, is_recurring, date } = req.body;
        const user_id = req.user?.id;

        const utcDate = new Date(date);
        const localDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
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
            date: localDate
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
        const { search } = req.query;

        let searchObject = {};
        if (search) {
            try {
                searchObject = JSON.parse(search);
            } catch (err) {
                console.error('Invalid search query:', err);
            }
        }

        let query = `WHERE user_id = '${user_id}'`;

        if (searchObject) {
            if (searchObject.month && searchObject.year) {
                query += ` AND EXTRACT(MONTH FROM date) = ${searchObject.month} AND EXTRACT(YEAR FROM date) = ${searchObject.year}`;
            }
        }

        const transactions = await transactionSchema.find(query);
        res.status(200).json(transactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
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

const getUserMonthlySummary = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const { month, year } = req.body;

        const user = await userSchema.findOne(`WHERE id = '${user_id}'`);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const summary = await _vm_user_monthly_summary.find(`WHERE user_id = '${user_id}' AND month = ${month} AND year = ${year}`);
        res.status(200).json(summary ? summary[0] : null);
    } catch (error) {
        console.error('Error getting user monthly summary:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    getUserMonthlySummary
} 