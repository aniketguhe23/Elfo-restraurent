"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectApiList from "@/app/api/ProjectApiList";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { UserIcon, MapPinIcon, PhoneIcon, UtensilsIcon } from "lucide-react";

export default function OrderDetailPage() {
  const { apiGetOrdersById, apiUpdateStatusOrdersById } = ProjectApiList();
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("order_no");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [amountReceivedBy, setAmountReceivedBy] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("");
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${apiGetOrdersById}/${orderNo}`);
      setOrder(res.data.data);
      setStatus(res.data.data?.order_status || "");
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${apiUpdateStatusOrdersById}/${orderNo}`, {
        status,
      });
      toast.success("Order status updated");
      fetchOrder();
      setOpen(false);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await axios.put(`${apiUpdateStatusOrdersById}/${orderNo}`, {
        payment_status: paymentStatus,
        amount_received_by: amountReceivedBy,
      });
      toast.success("Payment status updated");
      fetchOrder();
      setOpenPaymentDialog(false);
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  useEffect(() => {
    if (orderNo) fetchOrder();
  }, [orderNo]);

  const statusColorMap: Record<string, string> = {
    Pending: "border-yellow-400 text-yellow-600",
    Confirmed: "border-blue-500 text-blue-600",
    Accepted: "border-sky-500 text-sky-600",
    Processing: "border-orange-400 text-orange-600",
    Ready_For_Delivery: "border-amber-500 text-amber-600",
    Food_on_the_way: "border-indigo-500 text-indigo-600",
    Delivered: "border-green-500 text-green-600",
    Dine_In: "border-purple-500 text-purple-600",
    Refunded: "border-pink-500 text-pink-600",
    Refunded_Requested: "border-rose-500 text-rose-600",
    Scheduled: "border-cyan-500 text-cyan-600",
    Payment_Failed: "border-red-500 text-red-600",
    Cancelled: "border-gray-400 text-gray-500",
    Cancelled_By_Customer: "border-zinc-400 text-zinc-500",
  };

  if (loading)
    return <div className="p-4 text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order?.Order_no}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on: {new Date(order?.created_at).toLocaleString("en-IN")}
          </p>
          <p className="text-sm mt-1 text-muted-foreground">
            Restaurant: {order?.restaurantInfo?.name} –{" "}
            {order?.restaurantInfo?.address}
          </p>
        </div>

        <div className="space-y-2 flex justify-end items-end">
          {/* <Button
            onClick={() => {
              const params = new URLSearchParams({
                order_no: order?.Order_no,
              });

              router.push(`/orders/invoice?${params.toString()}`);
            }}
            className="w-40"
          >
            Print Invoice
          </Button> */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="w-40"
            >
              Update Status
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenPaymentDialog(true)}
              className="w-40"
            >
              Update Payment
            </Button>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  order_no: order?.Order_no,
                });

                router.push(`/orders/invoice?${params.toString()}`);
              }}
              className="w-40"
            >
              Print Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium">
                {order?.type === "pickup" ? "Pick up" : "Delivery"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={
                  statusColorMap[order.order_status] ||
                  "border-gray-300 text-gray-600"
                }
              >
                {order.order_status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <Badge variant="outline">{order?.payment_method}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment Status</p>
              {order?.payment_status === "Paid" && (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Paid
                </Badge>
              )}
              {order?.payment_status === "Unpaid" && (
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-800"
                >
                  Unpaid
                </Badge>
              )}
              {order?.payment_status === "Refunded" && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-400"
                >
                  Refunded
                </Badge>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">Payment Received By</p>
              <Badge variant="outline">{order?.amount_received_by ?? "not selected"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ordered Items */}
      <Card>
        <CardHeader>
          <CardTitle>Ordered Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="space-y-4">
            {order?.items?.map((item: any, idx: number) => (
              <div key={idx} className="border p-4 rounded-md space-y-2">
                {/* 🧩 Case 1: New structure (non-pizza items like drinks) */}
                {item?.item_id && !item?.type ? (
                  <>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} × {item.quantity}
                    </p>
                    <p className="text-sm font-medium">Total: ₹{item.total}</p>
                  </>
                ) : item.type === "preset" ? (
                  <>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} × {item.quantity}
                    </p>
                    {item.size && <p className="text-sm">Size: {item.size}</p>}
                    {item.crust && (
                      <p className="text-sm">Crust: {item.crust}</p>
                    )}
                    {item.toppings?.length > 0 && (
                      <p className="text-sm">
                        Toppings: {item.toppings.join(", ")}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-primary">Custom Pizza</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {/* Sizes */}
                      {item.selections?.sizes && (
                        <div>
                          <p className="font-medium">Size</p>
                          <p className="text-sm">
                            {item.selections.sizes.name} - ₹
                            {item.selections.sizes.price}
                          </p>
                        </div>
                      )}

                      {/* Dough */}
                      {item.selections?.doughTypes && (
                        <div>
                          <p className="font-medium">Dough</p>
                          <p className="text-sm">
                            {item.selections.doughTypes.name} - ₹
                            {item.selections.doughTypes.price}
                          </p>
                        </div>
                      )}

                      {/* Crust */}
                      {item.selections?.crustTypes && (
                        <div>
                          <p className="font-medium">Crust</p>
                          <p className="text-sm">
                            {item.selections.crustTypes.name} - ₹
                            {item.selections.crustTypes.price}
                          </p>
                        </div>
                      )}

                      {/* Sauces */}
                      {item.selections?.sauces?.length > 0 && (
                        <div>
                          <p className="font-medium">Sauces</p>
                          {item.selections.sauces.map(
                            (sauce: any, i: number) => (
                              <p key={i} className="text-sm">
                                {sauce.name} - ₹{sauce.price}
                              </p>
                            )
                          )}
                        </div>
                      )}

                      {/* Cheese */}
                      {item.selections?.cheeseOptions?.length > 0 && (
                        <div>
                          <p className="font-medium">Cheese</p>
                          {item.selections.cheeseOptions.map(
                            (cheese: any, i: number) => (
                              <p key={i} className="text-sm">
                                {cheese.name} - ₹{cheese.price}
                              </p>
                            )
                          )}
                        </div>
                      )}

                      {/* Toppings */}
                      {item.selections?.toppings?.length > 0 && (
                        <div>
                          <p className="font-medium">Toppings</p>
                          {item.selections.toppings.map(
                            (topping: any, i: number) => (
                              <p key={i} className="text-sm">
                                {topping.name} - ₹{topping.price}
                              </p>
                            )
                          )}
                        </div>
                      )}

                      {/* Extra Sauces */}
                      {item.selections?.extraSauces?.length > 0 && (
                        <div>
                          <p className="font-medium">Extra Sauces</p>
                          {item.selections.extraSauces.map(
                            (extra: any, i: number) => (
                              <p key={i} className="text-sm">
                                {extra.name} - ₹{extra.price}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Side Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserIcon size={16} />
              <p className="font-semibold">Customer Info</p>
            </div>
          </CardHeader>
          <CardContent>
            <p>{order?.userInfo?.firstName}</p>
            <p className="text-sm text-muted-foreground">
              {order?.userInfo?.mobile}
            </p>
            <p className="text-sm text-muted-foreground">
              {order?.userInfo?.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon size={16} />
              <p className="font-semibold">Delivery Address</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order?.address || "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UtensilsIcon size={16} />
              <p className="font-semibold">Total Breakdown</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹ {order?.item_total || 0}</span>
            </div>
            {order?.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>- ₹ {order.discount}</span>
              </div>
            )}
            {order?.gst > 0 && (
              <div className="flex justify-between">
                <span>GST / Tax</span>
                <span>₹ {order.gst}</span>
              </div>
            )}
            {order?.delivery > 0 && (
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>₹ {order.delivery}</span>
              </div>
            )}
            {order?.service_charge > 0 && (
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>₹ {order.service_charge}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹ {order?.total_price || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total */}
      <div className="text-right">
        <p className="text-lg font-semibold">
          Total Amount:{" "}
          <span className="text-primary">₹{order?.total_price || 0}</span>
        </p>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the order status and confirm update.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Status Select */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Ready_For_Delivery">
                    Ready For Delivery
                  </SelectItem>
                  <SelectItem value="Food_on_the_way">
                    Food On The Way
                  </SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Refunded_Requested">Refunded Requested</SelectItem>
                  {/* <SelectItem value="Cancelled_By_Customer">
                    Cancelled By Customer
                  </SelectItem> */}
                  {/* <SelectItem value="Accepted">Accepted</SelectItem> */}
                  {/* <SelectItem value="Dine_In">Dine In</SelectItem> */}
                  {/* 
                    Refunded Requested
                  </SelectItem> */}
                  {/* <SelectItem value="Scheduled">Scheduled</SelectItem> */}
                  {/* <SelectItem value="Payment_Failed">Payment Failed</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Change the payment status and confirm update.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Payment Status</Label>
            <Select
              value={paymentStatus}
              onValueChange={(val) => setPaymentStatus(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Received By Select */}
          <div className="space-y-2">
            <Label>Amount Received By</Label>
            <Select
              value={amountReceivedBy}
              onValueChange={setAmountReceivedBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select person or channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery person">Delivery Person</SelectItem>
                <SelectItem value="resturant">Restaurant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePaymentUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
