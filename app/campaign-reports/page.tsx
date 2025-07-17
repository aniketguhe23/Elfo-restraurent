"use client"

import { useState } from "react"
import { Search, FileDown, ChevronDown, FileBarChart, Clock, TruckIcon, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"

const campaignData = [
  {
    id: "100157",
    restaurant: "Elfo's Pizza",
    customer: "Amit Sharma",
    totalAmount: "Rs. 2000",
    isPaid: true,
    itemDiscount: "Rs. 2000",
    couponDiscount: "Rs. 0.00",
    referralDiscount: "Rs. 0.00",
    discountedAmount: "Rs. 0.00",
    tax: "Rs. 0.00",
  },
  {
    id: "100156",
    restaurant: "Elfo's Pizza",
    customer: "Vedika Arora",
    totalAmount: "Rs. 3000",
    isPaid: false,
    itemDiscount: "Rs. 3000",
    couponDiscount: "Rs. 0.00",
    referralDiscount: "Rs. 0.00",
    discountedAmount: "Rs. 50.0",
    tax: "Rs. 50.0",
  },
]

export default function CampaignReportsPage() {
  const [timeFilter1, setTimeFilter1] = useState("All Time")
  const [timeFilter2, setTimeFilter2] = useState("All Time")

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <FileBarChart className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Food Campaign Order Report</h1>
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

        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Search Data</h2>
            <div className="flex items-center gap-4">
              <Select value={timeFilter1} onValueChange={setTimeFilter1}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Time">All Time</SelectItem>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter2} onValueChange={setTimeFilter2}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Time">All Time</SelectItem>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto">
                <Button className="bg-blue-500 hover:bg-blue-600">Filter</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-600"
                  >
                    <path d="M12 1v6m0 0 4-4m-4 4L8 3" />
                    <path d="M12 13v8" />
                    <path d="M16 8h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">10</p>
                <p className="text-sm text-muted-foreground mb-2">Total orders</p>
                <p className="text-sm font-medium">Total order Amount: Rs.20k</p>
              </CardContent>
            </Card>

            <Card className="bg-pink-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">In progress orders</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <TruckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">On the way</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Delivered Orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-red-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Failed orders</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Refunded orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-red-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Canceled Orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <div className="flex items-center gap-4">
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">SI</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Item Amount</TableHead>
                    <TableHead>Item Discount</TableHead>
                    <TableHead>Coupon Discount</TableHead>
                    <TableHead>Referral Discount</TableHead>
                    <TableHead>Discounted Amount</TableHead>
                    <TableHead>Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignData.map((order, index) => (
                    <TableRow key={order.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.restaurant}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <div>
                          {order.totalAmount}
                          <div className={`text-sm ${order.isPaid ? "text-green-500" : "text-red-500"}`}>
                            {order.isPaid ? "Paid" : "Unpaid"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order.itemDiscount}</TableCell>
                      <TableCell>{order.couponDiscount}</TableCell>
                      <TableCell>{order.referralDiscount}</TableCell>
                      <TableCell>{order.discountedAmount}</TableCell>
                      <TableCell>{order.tax}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
