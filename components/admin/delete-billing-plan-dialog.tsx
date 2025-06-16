import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BillingPlan } from "../../admin/types/billingPlan";

interface DeleteBillingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: BillingPlan | null;
  onDelete: (plan: BillingPlan) => void;
}

export function DeleteBillingPlanDialog({ open, onOpenChange, plan, onDelete }: DeleteBillingPlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Delete Billing Plan</DialogTitle>
        <p>Are you sure you want to delete the plan "{plan?.name}"?</p>
        <DialogFooter>
          <Button variant="destructive" onClick={() => { if (plan) { onDelete(plan); } onOpenChange(false); }}>Delete</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
