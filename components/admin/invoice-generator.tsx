"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Check, FileText, Plus, Trash } from "lucide-react"
import { format } from "date-fns"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../wasl-integration/app/redux/store";
import { fetchInvoices } from "../../../wasl-integration/app/admin/store/slices/paymentPlanSlice";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const invoiceFormSchema = z.object({
  customerId: z.string({
    required_error: "Please select a customer.",
  }),
  invoiceDate: z.date({
    required_error: "Invoice date is required.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.coerce.number().positive("Quantity must be positive"),
        unitPrice: z.coerce.number().positive("Unit price must be positive"),
      }),
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

export function InvoiceGenerator({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, setIsPending] = useState(false)
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([])
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("https://wasl-api.tracking.me/api/admin/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        // Debug: log the API response to check structure
        console.log('Customer API response:', data);
        // Try to find the correct array of customers
        let customerArr = [];
        if (Array.isArray(data)) {
          customerArr = data;
        } else if (Array.isArray(data?.data)) {
          customerArr = data.data;
        } else if (Array.isArray(data?.customers)) {
          customerArr = data.customers;
        }
        setCustomers(
          customerArr.map((c: any) => ({
            id: String(c.id),
            name:
              c.name ||
              c.fullName ||
              c.company_name ||
              c.title ||
              c.username ||
              c.email ||
              JSON.stringify(c) // fallback: show the whole object if no name
          }))
        );
      } catch (e) {
        setCustomers([]);
      }
    }
    if (token) fetchCustomers();
  }, [token]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    },
  })

  // Correctly use useFieldArray as a separate hook, not as a method on form
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const onSubmit = async (values: InvoiceFormValues) => {
    setIsPending(true);
    try {
      // Prepare items array for API (convert unitPrice to unit_price)
      const items = values.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));
      // Map form values to API payload
      const payload = {
        user_id: Number(values.customerId),
        invoice_date: values.invoiceDate.toISOString().slice(0, 10),
        invoice_due_date: values.dueDate.toISOString().slice(0, 10),
        items, // send items array as required by backend
        subtotal: items.reduce((total, item) => total + item.quantity * item.unit_price, 0),
        vat: Math.round(items.reduce((total, item) => total + item.quantity * item.unit_price, 0) * 0.15),
        total: Math.round(items.reduce((total, item) => total + item.quantity * item.unit_price, 0) * 1.15),
        notes: values.notes,
        invoice_status: "pending",
      };
      await fetch("https://wasl-api.tracking.me/api/admin/invoices", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Invoice payload:", payload); // Debug: log the payload being sent
      toast({
        title: "Invoice generated",
        description: "The invoice has been generated successfully.",
      });
      if (onSuccess) onSuccess();
      dispatch(fetchInvoices({ page: 1 }));
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate invoice." });
    }
    setIsPending(false);
  }

  // Calculate subtotal
  const subtotal = fields.reduce((total, field, index) => {
    const quantity = form.watch(`items.${index}.quantity`) || 0
    const unitPrice = form.watch(`items.${index}.unitPrice`) || 0
    return total + quantity * unitPrice
  }, 0)

  // Calculate tax (15% VAT)
  const taxRate = 0.15
  const tax = subtotal * taxRate

  // Calculate total
  const total = subtotal + tax

  // CustomDropdown component for customer selection
  function CustomDropdown({ value, onChange, options, error }: {
    value: string;
    onChange: (val: string) => void;
    options: { id: string; name: string }[];
    error?: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">Customer</label>
        <select
          className={`w-full border rounded px-3 py-2  ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">Select a customer</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Invoice
        </CardTitle>
        <CardDescription>Create a new invoice for a customer</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    value={field.value}
                    onChange={field.onChange}
                    options={customers}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Invoice Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-4 rounded-md border p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="API usage for June 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Unit Price (SAR)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        className="h-10 w-10"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes or payment instructions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>These notes will appear on the invoice</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-md border p-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "SAR",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">VAT (15%):</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "SAR",
                    }).format(tax)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 font-medium">
                  <span>Total:</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "SAR",
                    }).format(total)}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">Preview Invoice</Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className="flex items-center gap-2">
          {isPending ? (
            "Generating..."
          ) : (
            <>
              <Check className="h-4 w-4" />
              Generate Invoice
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
