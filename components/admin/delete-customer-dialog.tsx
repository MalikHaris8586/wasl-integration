"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteCustomerDialogProps {
  customerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteCustomerDialog({ customerName, open, onOpenChange, onConfirm }: DeleteCustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onConfirm()
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Customer</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium">{customerName}</span>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-100 rounded-md p-4 my-2">
          <div className="text-sm text-red-800">
            <p className="font-medium">Warning: This will permanently delete:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>All customer account information</li>
              <li>Integration settings and API keys</li>
              <li>Usage history and statistics</li>
              <li>Access control settings</li>
            </ul>
            <p className="mt-2">The customer will immediately lose access to the platform and all their data.</p>
          </div>
        </div>

        <DialogFooter className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
