// components/EditScheduleModal.tsx
"use client";

import {
  Dialog,
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
import { useEffect } from "react";
import axios from "axios";
import ProjectApiList from "@/app/api/ProjectApiList";
import { Switch } from "@/components/ui/switch";

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  schedule: {
    id: string;
    weekday: string;
    opening_time: string;
    closing_time: string;
    restaurant_no: string;
    is_open: boolean;
  };
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type FormFields = {
  weekday: string;
  opening_time: string;
  closing_time: string;
  is_open: boolean;
};

export default function EditScheduleModal({
  open,
  onClose,
  onSuccess,
  schedule,
}: EditScheduleModalProps) {
  const { apiUpdateResturantHours } = ProjectApiList();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FormFields>();

  useEffect(() => {
    if (schedule) {
      setValue("weekday", schedule.weekday);
      setValue("opening_time", schedule.opening_time);
      setValue("closing_time", schedule.closing_time);
      setValue("is_open", schedule.is_open);
    }
  }, [schedule, setValue]);

  const onSubmit = async (data: FormFields) => {
    const payload = {
      id: schedule.id,
      weekday: data.weekday,
      opening_time: data.opening_time,
      closing_time: data.closing_time,
      is_open: data.is_open,
    };

    try {
      await axios.put(
        `${apiUpdateResturantHours}/${schedule.restaurant_no}`,
        payload
      );
      onSuccess();
      onClose();
      reset();
    } catch (err) {
      console.error("Failed to update schedule", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Weekday</Label>
            <Select
              onValueChange={(val) => setValue("weekday", val)}
              defaultValue={schedule.weekday}
              disabled
            >
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
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
