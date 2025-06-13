import { Dialog, DialogContent, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteBillingPlanDialog({ open, onOpenChange, plan, onDelete }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Delete Billing Plan</DialogTitle>
        <p>Are you sure you want to delete the plan "{plan?.name}"?</p>
        <DialogActions>
          <Button variant="destructive" onClick={() => { onDelete(plan); onOpenChange(false); }}>Delete</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
