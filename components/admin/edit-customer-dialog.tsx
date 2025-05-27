"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { store } from "@/app/redux/store"
import { updateCustomer } from "@/app/admin/store/slices/customerSlice"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  ip: z.string().optional(),
  genesis_session_key: z.string().min(1, { message: "Genesis Session Key is required." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  active: z.boolean(),
});

type Customer = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  active: number;
  setting?: {
    ip?: string;
    genesis_session_key?: string;
    url?: string;
  };
};

interface EditCustomerDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: any) => void;
}

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
}: EditCustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = store.dispatch;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone_number: customer.phone_number,
      ip: customer.setting?.ip || "",
      genesis_session_key: customer.setting?.genesis_session_key || "",
      url: customer.setting?.url || "",
      active: customer.active === 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      const updateData = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        active: values.active ? 1 : 0,
        setting: {
          ip: values.ip || "",
          genesis_session_key: values.genesis_session_key,
          url: values.url,
        },
      };

      await dispatch(updateCustomer({ 
        userId: customer.id, 
        data: updateData 
      }));

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update customer:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Make changes to the customer&apos;s information here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+966 123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genesis_session_key"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Genesis Session Key</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Customer will {field.value ? "be able" : "not be able"} to access the system
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
