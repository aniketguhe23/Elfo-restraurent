// components/EditBasicSettingsModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  editableBasic: any;
  setEditableBasic: Dispatch<SetStateAction<any>>;
  setBasicSettings: (data: any) => void;
  apiUpdateBasicSettings: string;
};

export const EditBasicSettingsModal = ({
  open,
  setOpen,
  editableBasic,
  setEditableBasic,
  setBasicSettings,
  apiUpdateBasicSettings,
}: Props) => {
  const handleSave = async () => {
    try {
      await axios.put(
        `${apiUpdateBasicSettings}/${editableBasic.restaurant_no}`,
        editableBasic
      );
      toast.success("Basic Settings updated");
      setBasicSettings(editableBasic);
      setOpen(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Basic Settings</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <Label>Packaging Charge Type</Label>
            <select
              value={editableBasic?.packaging_charge_type}
              onChange={(e) =>
                setEditableBasic({
                  ...editableBasic,
                  packaging_charge_type: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="Optional">Optional</option>
              <option value="Mandatory">Mandatory</option>
            </select>
          </div>

          <div>
            <Label>Packaging Charge Amount</Label>
            <Input
              value={editableBasic?.packaging_charge_amount}
              onChange={(e) =>
                setEditableBasic({
                  ...editableBasic,
                  packaging_charge_amount: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Minimum Order Amount</Label>
            <Input
              value={editableBasic?.min_order_amount}
              onChange={(e) =>
                setEditableBasic({
                  ...editableBasic,
                  min_order_amount: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Minimum Dine-In Time</Label>
            <Input
              type="time"
              value={editableBasic?.min_dinein_time || ""}
              onChange={(e) =>
                setEditableBasic({
                  ...editableBasic,
                  min_dinein_time: e.target.value, // ✅ Use string, not Number
                })
              }
            />
          </div>

          <div>
            <Label>GST Enabled</Label> <br />
            <Switch
              checked={editableBasic?.gst_enabled}
              onCheckedChange={(value) =>
                setEditableBasic({ ...editableBasic, gst_enabled: value })
              }
            />
          </div>

          <div>
            <Label>GST Percentage</Label>
            <select
              value={editableBasic?.gst_percentage}
              onChange={(e) =>
                setEditableBasic({
                  ...editableBasic,
                  gst_percentage: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label>Cuisines</Label>
            <Input
              value={editableBasic?.cuisines}
              onChange={(e) =>
                setEditableBasic({ ...editableBasic, cuisines: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label>Tags</Label>
            <Input
              value={editableBasic?.tags}
              onChange={(e) =>
                setEditableBasic({ ...editableBasic, tags: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
