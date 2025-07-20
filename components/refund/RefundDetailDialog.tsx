"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import ProjectApiList from "@/app/api/ProjectApiList";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  refund: any;
  onStatusChange?: (status: string) => void;
};

export default function RefundDetailDialog({ refund, onStatusChange }: Props) {
  const { apiUpdateRefundsStatus } = ProjectApiList();
  const [status, setStatus] = useState(refund?.status || "");
  const [loading, setLoading] = useState(false);

  console.log(refund)

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.post(`${apiUpdateRefundsStatus}/${refund.refundId}`, { status });
      onStatusChange?.(status);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-1">
      <DialogHeader>
        <DialogTitle className="text-lg md:text-xl">Refund Details</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-muted-foreground">Customer Name</Label>
          <p className="font-medium">
            {refund.userFirstName} {refund.userLastName}
          </p>
        </div>

        <div>
          <Label className="text-muted-foreground">Order ID</Label>
          <Link
            href={`/orders/orderById?order_no=${refund.Order_no}`}
            className="font-medium text-blue-600 hover:underline"
          >
            <p>{refund.Order_no}</p>
          </Link>
        </div>

        <div className="md:col-span-2">
          <Label className="text-muted-foreground">Reason for Refund</Label>
          <p className="font-medium">{refund.reason}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Refund Amount</Label>
          <p className="font-medium text-green-600">₹{refund.amount}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Current Status</Label>
          <p className="capitalize font-medium">{refund.status}</p>
        </div>
      </div>

      <div className="pt-2 space-y-2">
        <Label className="text-sm">Update Refund Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="pt-4">
        <Button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Updating..." : "Update Status"}
        </Button>
      </DialogFooter>
    </div>
  );
}
