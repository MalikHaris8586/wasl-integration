import { Dialog, DialogContent, DialogTitle, DialogActions } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function EditBillingPlanDialog({ open, onOpenChange, plan, onEdit }) {
  const [form, setForm] = useState({ ...plan });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onEdit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit Billing Plan</DialogTitle>
        <div className="space-y-2">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Plan Name" className="w-full border p-2" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />
          <input name="companyApiPrice" value={form.companyApiPrice} onChange={handleChange} placeholder="Company API Price" className="w-full border p-2" />
          <input name="driverApiPrice" value={form.driverApiPrice} onChange={handleChange} placeholder="Driver API Price" className="w-full border p-2" />
          <input name="vehicleApiPrice" value={form.vehicleApiPrice} onChange={handleChange} placeholder="Vehicle API Price" className="w-full border p-2" />
          <input name="locationApiPrice" value={form.locationApiPrice} onChange={handleChange} placeholder="Location API Price" className="w-full border p-2" />
        </div>
        <DialogActions>
          <Button onClick={handleSubmit}>Save</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
