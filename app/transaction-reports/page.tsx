"use client";

import { useEffect, useState } from "react";
import { Search, FileDown, ChevronDown, FileBarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProtectedRoute } from "@/components/protected-route";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectApiList from "../api/ProjectApiList";

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
];

export default function TransactionReportsPage() {
  const { apiGetAllOrdersForResturant, apiTransactionReportofResturant } =
    ProjectApiList();
  const router = useRouter();

  const [timeFilter, setTimeFilter] = useState("all");
  const [transactionReport, setTransactionReport] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);

  const [totalOrders, setTotalOrders] = useState<any[]>([]);
  const [searchOrderNo, setSearchOrderNo] = useState("");

  // ✅ Get restaurant number from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("restaurant");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed?.restaurants_no) {
          setResturant_no(parsed.restaurants_no);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage restaurant:", error);
    } finally {
      setRestaurantLoading(false);
    }
  }, []);

  // ✅ Fetch all orders
  const fetchTotalOrders = async () => {
    if (!restaurants_no) return;

    try {
      const response = await axios.get(
        `${apiGetAllOrdersForResturant}/${restaurants_no}`
      );
      setTotalOrders(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching total orders:", err);
      setError("Failed to load total orders.");
    }
  };

  // ✅ Fetch transaction report
  const fetchTransactionReport = async () => {
    if (!restaurants_no) return;

    try {
      const response = await axios.get(
        `${apiTransactionReportofResturant}?restaurant_id=${restaurants_no}&time=${timeFilter}`
      );
      setTransactionReport(response.data.data || {});
    } catch (err: any) {
      console.error("Error fetching transaction report:", err);
      setError("Failed to load transaction report.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch when restaurant number is ready
  useEffect(() => {
    if (restaurants_no && !restaurantLoading) {
      fetchTotalOrders();
      fetchTransactionReport();
    }
  }, [restaurants_no, restaurantLoading, timeFilter]);

  // ✅ Filter by order number (search)
  const filteredOrders = totalOrders.filter((order) =>
    order.Order_no?.toLowerCase().includes(searchOrderNo.toLowerCase())
  );


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
                <Input
                  type="search"
                  placeholder="Ex: Search Order Id"
                  className="w-[200px] lg:w-[300px] pl-8"
                />
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
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
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
                <p className="text-2xl font-bold text-green-600">Rs. {transactionReport?.complete?.totalAmount}</p>
                <p className="text-sm text-muted-foreground">
                  Complete Transaction
                </p>
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
                <p className="text-2xl font-bold text-blue-600">Rs. {transactionReport?.onHold?.totalAmount}</p>
                <p className="text-sm text-muted-foreground">
                  On Hold Transaction
                </p>
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
                <p className="text-2xl font-bold text-red-600">Rs. {transactionReport?.refunded?.totalAmount}</p>
                <p className="text-sm text-muted-foreground">
                  Refunded Transaction
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Order Transactions</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Ex: Search Order Id"
                  value={searchOrderNo}
                  onChange={(e) => setSearchOrderNo(e.target.value)}
                  className="w-[200px] lg:w-[300px] pl-8"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">SI</TableHead>
                    <TableHead>Order ID</TableHead>
                    {/* <TableHead>Restaurant</TableHead> */}
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Item Amount</TableHead>
                    {/* <TableHead>Item Discount</TableHead> */}
                    <TableHead>Coupon Discount</TableHead>
                    {/* <TableHead>Referral Discount</TableHead> */}
                    <TableHead>Discounted Amount</TableHead>
                    <TableHead>Vat/tax</TableHead>
                    <TableHead>Delivery Charge</TableHead>
                    {/* <TableHead>Service Charge</TableHead> */}
                    <TableHead>Extra Packaging Amount</TableHead>
                    <TableHead>Total Item Amount</TableHead>
                    <TableHead>Amount Received by</TableHead>
                    <TableHead>Payent Method</TableHead>
                    {/* <TableHead>Order Status</TableHead> */}
                    {/* <TableHead>Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <TableRow key={order.Order_no}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order.Order_no}</TableCell>
                        {/* <TableCell>{order.restaurantInfo.address}</TableCell> */}
                        <TableCell>
                          {order.userInfo.firstName} {order.userInfo.lastName}
                        </TableCell>
                        <TableCell>
                          <div> ₹{order.item_total}</div>
                        </TableCell>
                        <TableCell> ₹{order.discount}</TableCell>
                        <TableCell> ₹{order.discount}</TableCell>
                        <TableCell>{order.gst}%</TableCell>
                        <TableCell>
                          {order.delivery == null ? "NA" : order.delivery}
                        </TableCell>
                        <TableCell> ₹{order.packaging_charge}</TableCell>
                        <TableCell>
                          <div>
                            ₹{order.total_price}
                            <div
                              className={`text-sm ${
                                order.payment_status == "Paid"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {order.payment_status}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.amount_received_by}</TableCell>
                        <TableCell>{order.payment_method}</TableCell>
                        {/* <TableCell>
                          <span
                            className={`px-2 py-1 text-sm rounded-md font-medium ${getStatusStyles(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </TableCell> */}
                        {/* <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-500 border-blue-500"
                            onClick={() =>
                              router.push(
                                `/orders/orderById?order_no=${order.Order_no}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={14}
                        className="text-center py-6 text-gray-500"
                      >
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
