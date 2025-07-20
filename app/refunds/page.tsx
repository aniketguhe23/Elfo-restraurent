"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Settings } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import ProjectApiList from "../api/ProjectApiList";
import RefundDetailDialog from "@/components/refund/RefundDetailDialog";

type Refund = {
  id: string;
  Order_no: string;
  orderId: string;
  userName: string;
  reason: string;
  amount: number;
  status: string;
  createdAt: string;
};

export default function RefundListPage() {
  const { apiGetRefundsByResNo } = ProjectApiList();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [selected, setSelected] = useState<Refund | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (refund: Refund) => {
    setSelected(refund);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("restaurant");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRestaurantId(parsed.restaurants_no); // ✅ Adjust field name if needed
    }
  }, []);

  useEffect(() => {
    const fetchRefunds = async () => {
      if (!restaurantId) return;
      try {
        const res = await axios.get(`${apiGetRefundsByResNo}/${restaurantId}`);
        setRefunds(res.data.data);
      } catch (error) {
        console.error("Error fetching refunds:", error);
      }
    };
    fetchRefunds();
  }, [restaurantId]);

  return (
    <>
      <header className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Settings className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Refunud</h1>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>All Refund Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {refunds.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No refund requests found.
            </p>
          ) : (
            refunds?.map((refund) => (
              <div
                key={refund?.id}
                className="flex justify-between items-center border rounded p-3"
              >
                <div>
                  <p className="font-medium">{refund?.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {refund?.Order_no}
                  </p>
                  <p className="text-sm">
                    ₹{refund?.amount} — {refund?.reason}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{refund?.status}</Badge>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => handleOpenDialog(refund)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      {selected && (
                        <RefundDetailDialog
                          refund={selected}
                          onStatusChange={(newStatus: string) => {
                            setRefunds((prev) =>
                              prev.map((r) =>
                                r.id === selected.id
                                  ? { ...r, status: newStatus }
                                  : r
                              )
                            );
                            handleCloseDialog(); // ✅ close after update
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
