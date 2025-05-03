"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, AlertCircle } from "lucide-react"

interface ConfirmDeleteDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    description?: string
}

export function ConfirmDeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "ยืนยันการลบรายการ",
    description = "คุณต้องการลบรายการนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-red-50 dark:bg-red-900/20">
                <div className=" px-6 pt-6 flex items-center gap-4">
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg">{title}</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-1">
                            {description}
                        </DialogDescription>
                    </div>
                </div>



                <div className="flex justify-end gap-3 mx-4">
                    <Button variant="outline" onClick={onClose}>
                        ยกเลิก
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        ยืนยันการลบ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 