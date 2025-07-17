"use client";

import { useState } from "react";
import { Wallet, Trash2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/protected-route";

const withdrawRequests = [
  {
    id: 1,
    amount: "Rs.100",
    requestTime: "05 Apr 2025 10:13 PM",
    method: "Card",
    type: "Withdraw Request",
    status: "Pending",
    note: "N/A",
  },
  {
    id: 2,
    amount: "Rs.200",
    requestTime: "09 Jun 2025 11:13 PM",
    method: "Default Method",
    type: "Withdraw Request",
    status: "Pending",
    note: "N/A",
  },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("withdraw-request");

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <Wallet className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Restaurant Wallet</h1>
          </div>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white">
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
                <p className="text-2xl font-bold">Rs. 10</p>
                <p className="text-sm text-muted-foreground">Cash in Hand</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
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
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">Rs. 1</p>
                <p className="text-sm text-muted-foreground">
                  Withdraw able balance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-green-600">Rs.1200</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Balance Unadjusted
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Adjust With Wallet
                    <Info className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Request With Draw
                    <Info className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-orange-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
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
                    className="text-orange-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">Rs.100</p>
                  <p className="text-sm text-muted-foreground">
                    Pending withdraw
                  </p>
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
                    <path d="M12 1v6m0 0 4-4m-4 4L8 3" />
                    <path d="M12 13v8" />
                    <path d="M16 8h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">Rs.0.00</p>
                  <p className="text-sm text-muted-foreground">
                    Total Withdrawn
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
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
                    className="text-purple-600"
                  >
                    <path d="M12 1v6m0 0 4-4m-4 4L8 3" />
                    <path d="M12 13v8" />
                    <path d="M16 8h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">Rs.1,000</p>
                  <p className="text-sm text-muted-foreground">Total earning</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="withdraw-request">
                Withdraw Request
              </TabsTrigger>
              <TabsTrigger value="payment-history">Payment History</TabsTrigger>
              <TabsTrigger value="next-payouts">Next Payouts</TabsTrigger>
            </TabsList>

            <TabsContent value="withdraw-request">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">SI</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Request Time</TableHead>
                        <TableHead>Withdraw Method</TableHead>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.id}</TableCell>
                          <TableCell>{request.amount}</TableCell>
                          <TableCell>{request.requestTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-blue-600">
                              {request.method}
                            </Badge>
                          </TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-blue-600">
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{request.note}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 border-red-500 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment-history">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No payment history available
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="next-payouts">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No upcoming payouts</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
