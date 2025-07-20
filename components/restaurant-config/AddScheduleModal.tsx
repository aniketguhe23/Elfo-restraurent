// components/AddScheduleModal.tsx
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import ProjectApiList from "@/app/api/ProjectApiList";
import { Switch } from "@/components/ui/switch";

interface AddScheduleModalProps {
  restaurantNo: string;
  onClose: () => void;
  onSuccess: () => void;
}


type FormFields = {
  weekday: string;
  opening_time: string;
  closing_time: string;
  is_open: boolean;
};


const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function AddScheduleModal({
  restaurantNo,
  onSuccess,
}: AddScheduleModalProps) {
  const { apiPostResturantHours } = ProjectApiList();
  const [open, setOpen] = useState(false);
 const { register, handleSubmit, setValue, reset, watch } = useForm<FormFields>({
  defaultValues: {
    weekday: "",
    opening_time: "",
    closing_time: "",
    is_open: true,
  },
});


  const onSubmit = async (data: any) => {
    const payload = {
      restaurant_no: restaurantNo,
      weekday: data.weekday,
      is_open: data.is_open ?? true,
      opening_time: data.opening_time,
      closing_time: data.closing_time,
    };

    try {
      await axios.post(apiPostResturantHours, payload);
      onSuccess();
      reset();
      setOpen(false);
    } catch (err) {
      console.error("Failed to add schedule", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add Schedule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Restaurant Timing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Weekday</Label>
            <Select onValueChange={(val) => setValue("weekday", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select weekday" />
              </SelectTrigger>
              <SelectContent>
                {weekdays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Opening Time</Label>
            <Input type="time" {...register("opening_time")} required />
          </div>

          <div>
            <Label>Closing Time</Label>
            <Input type="time" {...register("closing_time")} required />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_open"
              checked={watch("is_open")}
              onCheckedChange={(checked) => setValue("is_open", checked)}
            />
            <Label htmlFor="is_open">Is Open</Label>
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
