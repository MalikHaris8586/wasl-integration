import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, useEffect } from "react";
import type { BillingPlan } from "../../admin/types/billingPlan";

interface EditBillingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: BillingPlan | null;
  onEdit: (plan: BillingPlan) => void;
}

export function EditBillingPlanDialog({ open, onOpenChange, plan, onEdit }: EditBillingPlanDialogProps) {
  const defaultForm: BillingPlan = {
    id: '',
    name: '',
    description: '',
    companyApiPrice: 0,
    driverApiPrice: 0,
    vehicleApiPrice: 0,
    locationApiPrice: 0,
    isActive: false
  };
  const [form, setForm] = useState<BillingPlan>(plan || defaultForm);

  // Update form state if plan changes
  useEffect(() => {
    if (plan) setForm({ ...defaultForm, ...plan });
    else setForm(defaultForm);
  }, [plan]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name.endsWith('Price') ? Number(value) : value
    });
  };

  const handleSubmit = () => {
    onEdit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit Billing Plan</DialogTitle>
        <DialogDescription>
          Update the details of your billing plan below. All fields are required.
        </DialogDescription>
        <div className="space-y-2">
          <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Plan Name" className="w-full border p-2" />
          <input name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" className="w-full border p-2" />
          <input name="companyApiPrice" type="number" value={form.companyApiPrice !== undefined && form.companyApiPrice !== null ? String(form.companyApiPrice) : ''} onChange={handleChange} placeholder="Company API Price" className="w-full border p-2" />
          <input name="driverApiPrice" type="number" value={form.driverApiPrice !== undefined && form.driverApiPrice !== null ? String(form.driverApiPrice) : ''} onChange={handleChange} placeholder="Driver API Price" className="w-full border p-2" />
          <input name="vehicleApiPrice" type="number" value={form.vehicleApiPrice !== undefined && form.vehicleApiPrice !== null ? String(form.vehicleApiPrice) : ''} onChange={handleChange} placeholder="Vehicle API Price" className="w-full border p-2" />
          <input name="locationApiPrice" type="number" value={form.locationApiPrice !== undefined && form.locationApiPrice !== null ? String(form.locationApiPrice) : ''} onChange={handleChange} placeholder="Location API Price" className="w-full border p-2" />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
