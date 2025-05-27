"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface StatusDialogProps {
  response: string
}

export function StatusDialog({ response }: StatusDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Check Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>WASL API Response</DialogTitle>
          <DialogDescription>The detailed response from the WASL API.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-auto rounded bg-muted p-4">
          <pre className="text-xs">{response}</pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
