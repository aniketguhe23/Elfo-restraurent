"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvoicePageProps {
  order: any;
}

export default function InvoicePage({ order }: InvoicePageProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const itemTotal = order?.item_total || 0;
  const discount = order?.discount || 0;
  const vat = order?.gst || 0;
  const delivery = order?.delivery || 0;
  const service = order?.service_charge || 0;
  const total = order?.total_price || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto py-6 font-mono text-sm">
      {/* Top Buttons */}
      <div className="flex justify-between mb-4 print:hidden">
        <Button variant="outline" onClick={() => router.back()}>
          ← Go Back
        </Button>
        <Button onClick={handlePrint} className="bg-gray-800 text-white">
          🖨️ Print
        </Button>
      </div>

      <div ref={printRef} data-print="invoice" className="space-y-4">
        {/* Restaurant Info */}
        <div className="text-center">
          <p className="font-bold text-base">
            {order?.restaurantInfo?.name || "Restaurant"}
          </p>
          <p>{order?.restaurantInfo?.address || "—"}</p>
          <p className="text-muted-foreground text-xs">
            {new Date(order?.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          {order?.restaurantInfo?.contact_phone && (
            <p>Phone: {order.restaurantInfo.contact_phone}</p>
          )}
        </div>

        {/* Order Type */}
        <div className="flex justify-between">
          <p>Order Type</p>
          <p>{order?.type === "pickup" ? "Pickup/Dinein" : "Home Delivery"}</p>
        </div>

        {/* Customer & Order Info */}
        <Card>
          <CardContent className="space-y-1 py-3">
            <p>Order ID: {order?.Order_no}</p>
            <p>Customer Name: {order?.userInfo?.firstName}</p>
            <p>Phone: {order?.userInfo?.mobile}</p>
          {order?.address &&  <p>Delivery Address: {order?.address || "—"}</p>}
          </CardContent>
        </Card>

        {/* Ordered Items */}
        <div>
          <div className="flex justify-between border-b pb-1 font-semibold">
            <p>QTY</p>
            <p>Item</p>
            <p>Price</p>
          </div>
          <ScrollArea className="space-y-3">
            {order?.items?.map((item: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <p>{item.quantity}x</p>
                  <p>{item.name || "Custom Pizza"}</p>
                  <p>₹ {item.price}</p>
                </div>

                {/* Details */}
                {item.type === "preset" ? (
                  <div className="pl-4 text-xs text-muted-foreground">
                    {item.size && <p>Size: {item.size}</p>}
                    {item.crust && <p>Crust: {item.crust}</p>}
                    {item.toppings?.length > 0 && (
                      <p>Toppings: {item.toppings.join(", ")}</p>
                    )}
                  </div>
                ) : (
                  <div className="pl-4 text-xs text-muted-foreground space-y-1 mt-1">
                    {item?.selections?.sizes && (
                      <p>
                        <strong>Size:</strong> {item.selections.sizes.name} (₹
                        {item.selections.sizes.price})
                      </p>
                    )}
                    {item?.selections?.doughTypes && (
                      <p>
                        <strong>Dough:</strong> {item.selections.doughTypes.name} (₹
                        {item.selections.doughTypes.price})
                      </p>
                    )}
                    {item?.selections?.crustTypes && (
                      <p>
                        <strong>Crust:</strong> {item.selections.crustTypes.name} (₹
                        {item.selections.crustTypes.price})
                      </p>
                    )}
                    {item?.selections?.sauces?.length > 0 && (
                      <p>
                        <strong>Sauces:</strong>{" "}
                        {item.selections.sauces
                          .map((s: any) => `${s.name} (₹${s.price})`)
                          .join(", ")}
                      </p>
                    )}
                    {item?.selections?.cheeseOptions?.length > 0 && (
                      <p>
                        <strong>Cheese:</strong>{" "}
                        {item.selections.cheeseOptions
                          .map((c: any) => `${c.name} (₹${c.price})`)
                          .join(", ")}
                      </p>
                    )}
                    {item?.selections?.toppings?.length > 0 && (
                      <p>
                        <strong>Toppings:</strong>{" "}
                        {item.selections.toppings
                          .map((t: any) => `${t.name} (₹${t.price})`)
                          .join(", ")}
                      </p>
                    )}
                    {item?.selections?.extraSauces?.length > 0 && (
                      <p>
                        <strong>Extra Sauces:</strong>{" "}
                        {item.selections.extraSauces
                          .map((e: any) => `${e.name} (₹${e.price})`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <p>Items Price</p>
            <p>₹ {itemTotal}</p>
          </div>
          <div className="flex justify-between font-semibold">
            <p>Subtotal</p>
            <p>₹ {itemTotal}</p>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-red-600">
              <p>Discount</p>
              <p>- ₹ {discount}</p>
            </div>
          )}
          {vat > 0 && (
            <div className="flex justify-between">
              <p>VAT / Tax</p>
              <p>₹ {vat}</p>
            </div>
          )}
          {delivery > 0 && (
            <div className="flex justify-between">
              <p>Delivery Charge</p>
              <p>₹ {delivery}</p>
            </div>
          )}
          {service > 0 && (
            <div className="flex justify-between">
              <p>Service Charge</p>
              <p>₹ {service}</p>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between font-bold text-base">
            <p>Total</p>
            <p>₹ {total}</p>
          </div>
          <p className="mt-1">Paid By: {order?.payment_method || "Cash On Delivery"}</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 font-semibold">
          <p>THANK YOU</p>
          <p className="text-xs font-normal">
            For ordering from {order?.restaurantInfo?.name || "our restaurant"}
          </p>
        </div>
      </div>
    </div>
  );
}
