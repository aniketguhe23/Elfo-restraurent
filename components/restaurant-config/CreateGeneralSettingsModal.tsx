"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";

export const CreateGeneralSettingsModal = ({
  open,
  onClose,
  onSuccess,
  apiCreateGeneralSettings,
  restaurant_no,
  alreadyCreated = false,
}: any) => {
  const [settings, setSettings] = useState({
    home_delivery: true,
    veg: true,
    subscription_based_order: false,
    cutlery: false,
    instant_order: true,
    take_away: true,
    dine_in: false,
    extra_packaging_charge: false,
    tag_status: true,
    // removed scheduled_delivery and non_veg from initial state
  });

  const handleChange = (key: string, value: boolean) => {
    if (alreadyCreated) return;
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { restaurant_no, ...settings };
      await axios.post(apiCreateGeneralSettings, payload);
      toast.success("General settings created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create general settings");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initial General Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(settings)
            .filter(
              ([key]) =>
                key !== "scheduled_delivery" && key !== "non_veg"
            )
            .map(([key, value]) => (
              <div className="flex justify-between items-center" key={key}>
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
                <Switch
                  checked={value}
                  disabled={alreadyCreated}
                  onCheckedChange={(val) => handleChange(key, val)}
                />
              </div>
            ))}

          <Button
            onClick={handleSubmit}
            disabled={alreadyCreated}
            className="w-full mt-4"
          >
            {alreadyCreated ? "Settings Already Created" : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
