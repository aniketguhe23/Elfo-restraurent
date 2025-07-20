"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

export function CreateRestaurantBasicSettingsModal({
  open,
  onClose,
  onSuccess,
  apiCreateBasicSettings,
  restaurant_no,
  alreadyCreated
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  apiCreateBasicSettings: string;
  restaurant_no: string;
  alreadyCreated: any;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      packaging_charge_type: "Optional",
      packaging_charge_amount: "0.00",
      min_order_amount: "0.00",
      min_dinein_time: 0,
      gst_enabled: false,
      gst_percentage: "0.00",
      cuisines: "",
      tags: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post(apiCreateBasicSettings, {
        restaurant_no,
        ...data,
      });
      toast.success("Basic Settings Created");
      onSuccess();
      reset();
    } catch (err) {
      toast.error("Failed to create basic settings");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Restaurant Basic Settings</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Packaging Type */}
            <div>
              <Label>Packaging Charge Type</Label>
              <select
                {...register("packaging_charge_type")}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Optional">Optional</option>
                <option value="Mandatory">Mandatory</option>
              </select>
            </div>

            {/* Packaging Amount */}
            <div>
              <Label>Packaging Charge Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register("packaging_charge_amount")}
              />
            </div>

            {/* Min Order Amount */}
            <div>
              <Label>Minimum Order Amount</Label>
              <Input
                type="number"
                step="0.01"
                {...register("min_order_amount")}
              />
            </div>

            {/* Minimum Dine-in Time */}
            <div>
              <Label>Minimum Dine-in Time (mins)</Label>
              <Input type="time" {...register("min_dinein_time")} />
            </div>

            {/* GST Enabled */}
            <div className="flex items-center space-x-2 mt-7">
              <Label>GST Enabled</Label>
              <Switch
                checked={watch("gst_enabled")}
                onCheckedChange={(val) => setValue("gst_enabled", val)}
              />
            </div>

            {/* GST Percentage */}
            <div>
              <Label>GST Percentage (%)</Label>
              <Input
                type="number"
                step="0.01"
                {...register("gst_percentage")}
              />
            </div>

            {/* Cuisines */}
            <div className="col-span-2">
              <Label>Cuisines (comma separated)</Label>
              <Input
                {...register("cuisines")}
                placeholder="e.g. North Indian, Pizza, Fast Food"
              />
            </div>

            {/* Tags */}
            <div className="col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input
                {...register("tags")}
                placeholder="e.g. popular, vegetarian, spicy"
              />
            </div>
          </div>

          <div className="pt-4 w-full flex justify-end">
            <Button type="submit" disabled={isSubmitting || alreadyCreated}>
              {alreadyCreated ? "Already Created" : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
