const Schema = require('../lib/db');

const budgetSchema = new Schema('budgets');
const userSchema = new Schema('users');
const categorySchema = new Schema('categories');

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

        res.status(201).json({ message: 'Budget created', budget: newBudget });
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAll = async (req, res) => {
    try {
        const { user_id, month } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        let query = `WHERE user_id = '${user_id}'`;
        
        if (month) {
            // Validate month format if provided
            if (!/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM format.' });
            }
            query += ` AND month = '${month}'`;
        }

        const budgets = await budgetSchema.find(query);

        // Get category details for each budget
        const budgetsWithCategories = await Promise.all(
            budgets.map(async (budget) => {
                const category = await categorySchema.findOne(`WHERE id = ${budget.category_id}`);
                return {
                    ...budget,
                    category_name: category ? category.name : null,
                    category_type: category ? category.type : null
                };
            })
        );

        res.status(200).json(budgetsWithCategories);
    } catch (error) {
        console.error('Error getting budgets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    create,
    getAll
}; 