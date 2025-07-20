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
    scheduled_delivery: true,
    home_delivery: true,
    veg: true,
    non_veg: true,
    subscription_based_order: false,
    cutlery: false,
    instant_order: true,
    take_away: true,
    dine_in: false,
    extra_packaging_charge: false,
    tag_status: true,
  });

  const handleChange = (key: string, value: boolean) => {
    if (alreadyCreated) return; // prevent changes if already created
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
          {Object.entries(settings).map(([key, value]) => (
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
