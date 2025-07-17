"use client"

import { useState } from "react"
import { Search, FileDown, ChevronDown, ClipboardList, Trash, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/protected-route"

const orderStatuses = [
  { name: "Pending", count: 5 },
  { name: "Confirmed", count: 3 },
  { name: "Accepted", count: 2 },
  { name: "Cooking", count: 1 },
  { name: "Ready For Delivery", count: 0 },
  { name: "Food On The Way", count: 2 },
  { name: "Delivered", count: 10 },
  { name: "Dine In", count: 0 },
  { name: "Refunded", count: 1 },
  { name: "Refunded Requested", count: 0 },
  { name: "Scheduled", count: 1 },
  { name: "Payment Failed", count: 0 },
  { name: "Canceled", count: 2 },
]

const orders = [
  {
    id: "100160",
    date: "05 Apr 2025 10:13 PM",
    customer: {
      name: "Harry Potter",
      phone: "+91 7********",
    },
    amount: "Rs. 1,490.00",
    isPaid: false,
    status: "Pending",
    deliveryType: "Delivery",
  },
  {
    id: "100152",
    date: "25 May 2025 11:24 PM",
    customer: {
      name: "Krish Ved",
      phone: "+91 7********",
    },
    amount: "Rs. 3,550.00",
    isPaid: true,
    status: "Delivered",
    deliveryType: "Delivery",
  },
]

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("Pending")

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <header className="border-b bg-background sticky top-0 z-20">
          <div className="flex h-16 items-center px-4 gap-4">
            <ClipboardList className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Orders</h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Ex: Search Order Id" className="w-[200px] lg:w-[300px] pl-8" />
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r bg-muted/20 overflow-auto">
            {orderStatuses.map((status) => (
              <button
                key={status.name}
                className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${
                  selectedStatus === status.name ? "bg-accent font-medium" : ""
                }`}
                onClick={() => setSelectedStatus(status.name)}
              >
                {status.name}
                {status.count > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {status.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">SI</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Customer Information</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => (
                      <TableRow key={order.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div>
                            <div>{order.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{order.customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {order.amount}
                            <div className={`text-sm ${order.isPaid ? "text-green-500" : "text-red-500"}`}>
                              {order.isPaid ? "Paid" : "Unpaid"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : order.status === "Pending"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : ""
                            }`}
                          >
                            {order.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">{order.deliveryType}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-orange-500 border-orange-500 bg-transparent"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-blue-500 border-blue-500 bg-transparent"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
