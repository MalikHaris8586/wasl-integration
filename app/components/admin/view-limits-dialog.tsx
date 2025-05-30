"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface AccessControl {
  id: number
  user_id: number
  ip_address: string
  api_name: string
  allowed_calls: number
  used_calls: number
  created_at: string
  updated_at: string
}

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  phone_number: string
  created_at: string
  updated_at: string
  active: number
  last_login_at: string | null
  last_active_at: string | null
  access_control: AccessControl[]
}

interface ViewLimitsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function ViewLimitsDialog({ open, onOpenChange, user }: ViewLimitsDialogProps) {
  useEffect(() => {
    console.log("Dialog state:", { open, userName: user.name });
  }, [open, user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Access Control Details</DialogTitle>
          <DialogDescription>
            View API access control limits and usage for {user.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Status:</span>
            <span className="col-span-3">{user.active === 1 ? "Active" : "Inactive"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Email:</span>
            <span className="col-span-3">{user.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Phone:</span>
            <span className="col-span-3">{user.phone_number}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Last Login:</span>
            <span className="col-span-3">{formatDate(user.last_login_at)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Last Active:</span>
            <span className="col-span-3">{formatDate(user.last_active_at)}</span>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">API Usage Limits</h3>
            {user.access_control.map((control) => {
              const percentage = (control.used_calls / control.allowed_calls) * 100
              return (
                <div key={control.id} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize">{control.api_name} API</span>
                    <span className="text-sm text-muted-foreground">
                      {control.used_calls} of {control.allowed_calls} calls used
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClassName={
                      percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : undefined
                    }
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    IP Address: {control.ip_address}
                  </div>
                </div>
              )
            })}
            {user.access_control.length === 0 && (
              <p className="text-muted-foreground">No API access controls set</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { ViewLimitsDialogProps } 