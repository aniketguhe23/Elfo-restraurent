"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ProjectApiList from "../api/ProjectApiList";
import Link from "next/link";

type SupportRequest = {
  id: number;
  order_id: string;
  restaurant_name: string;
  subject: string;
  message: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
};

export default function ContactSupportPage() {
  const { apiGetContactSUpport, apiUpdateSupportStatus } = ProjectApiList();
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [modalOpenId, setModalOpenId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<SupportRequest["status"]>("pending");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchSupportRequests = async () => {
    try {
      const res = await axios.get(apiGetContactSUpport);
      if (res.data.status === "success") {
        setSupportRequests(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch support requests", err);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const handleStatusChange = async (
    id: number,
    newStatus: SupportRequest["status"]
  ) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(`${apiUpdateSupportStatus}/${id}`, {
        status: newStatus,
      });

      if (res.data.status === "success") {
        setModalOpenId(null);
        await fetchSupportRequests();
      } else {
        console.error("Status update failed:", res.data.message);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Contact Support Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SI</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supportRequests.map((req, index) => (
            <TableRow key={req.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="text-blue-600 hover:underline cursor-pointer">
                <Link href={`/orders/orderById?order_no=${req.order_id}`}>
                  {req.order_id}
                </Link>
              </TableCell>
              <TableCell>{req.subject}</TableCell>
              <TableCell>{req.message}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    req.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : req.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {req.status}
                </span>
              </TableCell>

              <TableCell>
                <Dialog
                  open={modalOpenId === req.id}
                  key={modalOpenId}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) setModalOpenId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalOpenId(req.id);
                        setSelectedStatus(req.status);
                      }}
                    >
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label>Current Status: {req.status}</Label>
                      <div className="flex gap-2">
                        {["pending", "resolved", "rejected"].map((status) => (
                          <Button
                            key={status}
                            variant={
                              selectedStatus === status ? "default" : "outline"
                            }
                            onClick={() =>
                              setSelectedStatus(
                                status as SupportRequest["status"]
                              )
                            }
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={() =>
                          handleStatusChange(req.id, selectedStatus)
                        }
                        disabled={updatingId === req.id}
                      >
                        {updatingId === req.id
                          ? "Updating..."
                          : "Update Status"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
