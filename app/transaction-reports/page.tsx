"use client"

import { useState } from "react"
import { Search, FileDown, ChevronDown, FileBarChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"

const transactionData = [
  {
    id: "100157",
    restaurant: "Elfo's Pizza",
    customer: "Amit Sharma",
    totalAmount: "Rs. 2000",
    itemDiscount: "Rs. 2000",
    couponDiscount: "Rs. 0.00",
    referralDiscount: "Rs. 0.00",
    discountedAmount: "Rs. 0.00",
    vatTax: "Rs. 0.00",
    deliveryCharge: "Rs. 100",
    orderAmount: "Rs. 100",
    adminDiscount: "Rs. 100",
    restaurantDiscount: "Rs. 0.00",
  },
  {
    id: "100156",
    restaurant: "Elfo's Pizza",
    customer: "Vedika Arora",
    totalAmount: "Rs. 3000",
    itemDiscount: "Rs. 3000",
    couponDiscount: "Rs. 0.00",
    referralDiscount: "Rs. 0.00",
    discountedAmount: "Rs. 50.0",
    vatTax: "Rs. 50.0",
    deliveryCharge: "Rs. 100",
    orderAmount: "Rs. 100",
    adminDiscount: "Rs. 100",
    restaurantDiscount: "Rs. 0.00",
  },
]

export default function TransactionReportsPage() {
  const [timeFilter, setTimeFilter] = useState("All Time")

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <FileBarChart className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Transaction Report</h1>
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
              <Select value={timeFilter} onValueChange={setTimeFilter}>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-green-50 relative">
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
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
                    className="text-green-600"
                  >
                    <path d="M12 1v6m0 0 4-4m-4 4L8 3" />
                    <path d="M12 13v8" />
                    <path d="M16 8h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-green-600">Rs. 2000</p>
                <p className="text-sm text-muted-foreground">Complete Transaction</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 relative">
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100">
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
                    className="text-blue-600"
                  >
                    <path d="M12 1v6m0 0 4-4m-4 4L8 3" />
                    <path d="M12 13v8" />
                    <path d="M16 8h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-blue-600">Rs. 3000</p>
                <p className="text-sm text-muted-foreground">On Hold Transaction</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 relative">
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
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
                    className="text-red-600"
                  >
                    <path d="M12 1v6m0 0 4-4m-4 4L8 3" />
                    <path d="M12 13v8" />
                    <path d="M16 8h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-red-600">Rs. 2000</p>
                <p className="text-sm text-muted-foreground">Refunded Transaction</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Order Transactions</h3>
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
              <div className="overflow-x-auto">
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
                      <TableHead>Vat/Tax</TableHead>
                      <TableHead>Delivery Charge</TableHead>
                      <TableHead>Order Amount</TableHead>
                      <TableHead>Admin Discount</TableHead>
                      <TableHead>Restaurant Discount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData.map((transaction, index) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.restaurant}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.totalAmount}</TableCell>
                        <TableCell>{transaction.itemDiscount}</TableCell>
                        <TableCell>{transaction.couponDiscount}</TableCell>
                        <TableCell>{transaction.referralDiscount}</TableCell>
                        <TableCell>{transaction.discountedAmount}</TableCell>
                        <TableCell>{transaction.vatTax}</TableCell>
                        <TableCell>{transaction.deliveryCharge}</TableCell>
                        <TableCell>{transaction.orderAmount}</TableCell>
                        <TableCell>{transaction.adminDiscount}</TableCell>
                        <TableCell>{transaction.restaurantDiscount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
