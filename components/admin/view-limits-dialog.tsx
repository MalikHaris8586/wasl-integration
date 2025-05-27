"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User, CalendarClock } from "lucide-react"

// Define the user type
type User = {
  id: number
  name: string
  email: string
  phone_number: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  active: number
  last_login_at: string | null
  last_active_at: string | null
  access_control: any[]
}

interface ViewLimitsDialogProps {
  accessControl: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewLimitsDialog({ accessControl, open, onOpenChange }: ViewLimitsDialogProps) {
  if (!accessControl) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View user information and access control details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="font-medium">{accessControl.name}</span>
                    </div>
                    <Badge variant={accessControl.active ? "outline" : "destructive"}>
                      {accessControl.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">{accessControl.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-orange-500" />
                    <span className="font-medium">{accessControl.phone_number}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="font-medium">
                      Created: {new Date(accessControl.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {accessControl.last_login_at && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarClock className="h-5 w-5 mr-2 text-indigo-500" />
                      <span className="font-medium">
                        Last Login: {new Date(accessControl.last_login_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>
              This user has access to the WASL API services based on their assigned plan.
              The access level and permissions are managed through the access control settings.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
