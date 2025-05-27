"use client"

import { useState } from "react"
import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Define the history entry type
type AccessControlHistoryEntry = {
  id: string
  date: Date
  user: string
  action: "created" | "updated" | "deleted"
  apiType: string
  oldValue?: number
  newValue?: number
}

interface AccessControlHistoryDialogProps {
  customerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessControlHistoryDialog({ customerName, open, onOpenChange }: AccessControlHistoryDialogProps) {
  // Sample history data - in a real app, this would come from an API
  const [history] = useState<AccessControlHistoryEntry[]>([
    {
      id: "1",
      date: new Date(2023, 5, 15, 10, 30),
      user: "admin@example.com",
      action: "created",
      apiType: "Company API",
      newValue: 50,
    },
    {
      id: "2",
      date: new Date(2023, 6, 2, 14, 45),
      user: "admin@example.com",
      action: "updated",
      apiType: "Company API",
      oldValue: 50,
      newValue: 75,
    },
    {
      id: "3",
      date: new Date(2023, 6, 10, 9, 15),
      user: "manager@example.com",
      action: "updated",
      apiType: "Driver API",
      oldValue: 100,
      newValue: 200,
    },
    {
      id: "4",
      date: new Date(2023, 7, 5, 16, 20),
      user: "admin@example.com",
      action: "updated",
      apiType: "Vehicle API",
      oldValue: 80,
      newValue: 150,
    },
    {
      id: "5",
      date: new Date(2023, 8, 12, 11, 0),
      user: "manager@example.com",
      action: "updated",
      apiType: "Company API",
      oldValue: 75,
      newValue: 100,
    },
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Access Control History for {customerName}</DialogTitle>
          <DialogDescription>View all changes made to access control limits</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>API Type</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(entry.date, "PPp")}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.action === "created" ? "default" : entry.action === "updated" ? "outline" : "destructive"
                      }
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.apiType}</TableCell>
                  <TableCell>
                    {entry.action === "created"
                      ? `Set to ${entry.newValue}`
                      : entry.action === "updated"
                        ? `${entry.oldValue} → ${entry.newValue}`
                        : "Removed"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          <Button variant="outline">Export History</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
