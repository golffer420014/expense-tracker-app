export default interface iBudget {
    id: string;
    user_id: string;
    category_id: number;
    name: string;
    type: string;
    month: string;
    amount: string;
    created_at: string;
    isEditing: boolean;
}

