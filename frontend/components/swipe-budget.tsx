import React from 'react'
import { useSwipeable } from "react-swipeable";
import { Pencil, X, Check, Trash2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import iBudget from '@/interface/i-budget';
import { formatAmount } from '@/lib/utils';


const SwipeBudget = ({
    item,
    isActive,
    showMoney,
    onEdit,
    onDelete,
    onUpdate,
    onCancel,
    onChange,
    onSwipe
}: {
    item: iBudget,
    isActive: boolean,
    showMoney: boolean,
    onEdit: (id: string) => void,
    onDelete: (id: string) => void,
    onUpdate: (id: string, amount: number) => void,
    onCancel: (id: string) => void,
    onChange: (id: string, amount: number) => void,
    onSwipe: (id: string) => void
}) => {
    const swipeHandlers = useSwipeable({
        onSwipedRight: () => onSwipe(item.id),
        onSwipedLeft: () => onSwipe(""),
        trackMouse: true
    });


    return (
        <div className="relative overflow-hidden">
            <div
                {...swipeHandlers}
                className={`flex items-center justify-between p-4 transition-transform duration-400 ${isActive ? 'transform translate-x-16' : ''
                    }`}
            >
                <div className="flex items-center gap-2">
                    <List className={`h-4 w-4 transition-opacity duration-400 ${!isActive ? 'opacity-100' : 'opacity-0'}`} />
                    <span className={`font-medium transition-transform duration-400 ${isActive && '-translate-x-8'}`}>{item.name}</span>
                </div>
                {item.isEditing ? (
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            defaultValue={item.amount}
                            className="w-24 h-8"
                            onChange={(e) => {
                                const newBudget = Number.parseInt(e.target.value)
                                if (!isNaN(newBudget) && newBudget >= 0) {
                                    onChange(item.id, newBudget)
                                }
                            }}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdate(item.id, Number(item.amount))}>
                            <Check className="h-4 w-4 text-emerald-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onCancel(item.id)}>
                            <X className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span className={`transition-transform duration-400 ${isActive && '-translate-x-8'}`}>{formatAmount(item.amount, showMoney)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item.id)}>
                            <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete button that appears when swiped */}
            <div
                className="absolute top-0 left-0 h-full flex items-center justify-center bg-red-500 text-white"
                style={{
                    width: '64px',
                    transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.2s ease-in-out'
                }}
            >
                <Button
                    variant="link"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-red-600"
                    onClick={() => onDelete(item.id)}
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}


export default SwipeBudget;