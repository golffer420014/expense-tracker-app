const Schema = require('../lib/db');

const budgetSchema = new Schema('budgets');
const userSchema = new Schema('users');
const categorySchema = new Schema('categories');
const user_monthly_budgets = new Schema('user_monthly_budgets');

const create = async (req, res) => {
    try {
        const { category_id, month, amount } = req.body;
        const user_id = req.user?.id;

        if (!user_id || !category_id || !month || amount === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validate month format (YYYY-MM)
        if (!/^\d{4}-\d{2}$/.test(month)) {
            return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM format.' });
        }

        // Validate amount is a positive number
        if (isNaN(amount) || Number(amount) < 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        // Check if user exists
        const user = await userSchema.findOne(`WHERE id = '${user_id}'`);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if category exists
        const category = await categorySchema.findOne(`WHERE id = ${category_id}`);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Check if budget already exists for this user, category, and month
        const existingBudget = await budgetSchema.findOne(
            `WHERE user_id = '${user_id}' AND category_id = ${category_id} AND month = '${month}'`
        );

        if (existingBudget) {
            return res.status(400).json({ message: 'Budget already exists for this user, category, and month.' });
        }

        const newBudget = await budgetSchema.insert({
            user_id,
            category_id,
            month,
            amount
        });

        res.status(201).json(newBudget);
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAll = async (req, res) => {
    try {
        const { year, month } = req.query;
        const user_id = req.user?.id || req.user;


        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required.' });
        }


        // Get category details for each budget
        const budgets = await user_monthly_budgets.find(
            `
            WHERE user_id = '${user_id}'
            AND EXTRACT(YEAR FROM TO_DATE(month, 'YYYY-MM')) = ${Number(year)} 
            AND EXTRACT(MONTH FROM TO_DATE(month, 'YYYY-MM')) = ${Number(month)};`
        );

        res.status(200).json(budgets);
    } catch (error) {
        console.error('Error getting budgets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const user_id = req.user?.id || req.user;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Budget ID is required.' });
        }

        if (amount === undefined || isNaN(amount) || Number(amount) < 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        // Check if budget exists and belongs to the user
        const existingBudget = await budgetSchema.findOne(`WHERE id = '${id}' AND user_id = '${user_id}'`);
        
        if (!existingBudget) {
            return res.status(404).json({ message: 'Budget not found or does not belong to the user.' });
        }

        // Update the budget
        const updatedBudget = await budgetSchema.update(
            { amount },
            `id = '${id}' AND user_id = '${user_id}'`
        );

        res.status(200).json(updatedBudget);
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id || req.user;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Budget ID is required.' });
        }

        // Check if budget exists and belongs to the user
        const existingBudget = await budgetSchema.findOne(`WHERE id = '${id}' AND user_id = '${user_id}'`);
        
        if (!existingBudget) {
            return res.status(404).json({ message: 'Budget not found or does not belong to the user.' });
        }

        // Delete the budget
        await budgetSchema.delete(`WHERE id = '${id}' AND user_id = '${user_id}'`);

        res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    create,
    getAll,
    update,
    remove
}; 