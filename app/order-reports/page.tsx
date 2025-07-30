"use client";

import { useEffect, useState } from "react";
import {
  Search,
  FileDown,
  ChevronDown,
  FileBarChart,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
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
import ProjectApiList from "../api/ProjectApiList";
import { useRouter } from "next/navigation";

export default function OrderReportsPage() {
  const { apiOrderReportofResturant, apiGetAllOrdersForResturant } =
    ProjectApiList();
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState("all");

  const [ordersReport, setOrdersReport] = useState<any>({}); // ✅ FIXED: Changed from [] to {}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState<any[]>([]);
  const [searchOrderNo, setSearchOrderNo] = useState("");

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

  useEffect(() => {
    if (!restaurants_no) return;

    const fetchOrdersReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiOrderReportofResturant}?restaurant_id=${restaurants_no}&time=${timeFilter}`
        );
        setOrdersReport(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersReport();
  }, [restaurants_no, apiOrderReportofResturant, timeFilter]);

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

  // Fetch total orders when restaurant_no is ready
  useEffect(() => {
    if (restaurants_no && !restaurantLoading) {
      fetchTotalOrders();
    }
  }, [restaurants_no, restaurantLoading]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-600";
      case "Confirmed":
      case "Accepted":
      case "Processing":
      case "Ready_For_Delivery":
      case "Food_on_the_way":
      case "Scheduled":
        return "bg-yellow-100 text-yellow-600";
      case "Delivered":
      case "Dine_In":
        return "bg-green-100 text-green-600";
      case "Refunded":
        return "bg-purple-100 text-purple-600";
      case "Refunded_Requested":
        return "bg-pink-100 text-pink-600";
      case "Payment_Failed":
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredOrders = totalOrders.filter((order) =>
    order.Order_no.toLowerCase().includes(searchOrderNo.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <FileBarChart className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Order Report</h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Ex: Search Order Id"
                  className="w-[200px] lg:w-[300px] pl-8"
                />
              </div>
              {/* <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </header>

        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">ELFO'S PIZZA</h2>
          </div>

          <div className="flex items-center justify-between mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-amber-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Scheduled}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Scheduled Orders
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  <FileBarChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{ordersReport?.Pending}</p>
                  <p className="text-sm text-muted-foreground">
                    Pending Orders
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">{ordersReport?.Accepted}</p>
                  <p className="text-sm text-muted-foreground">
                    Accepted Orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Processing}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Processing Orders
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100">
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
                    className="text-cyan-600"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Food_on_the_way}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Food On the way
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
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
                    className="text-indigo-600"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Delivered}
                  </p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  <p className="text-2xl font-bold">
                    {ordersReport?.Cancelled}
                  </p>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-rose-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Payment_Failed}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Payment Failed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
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
                    className="text-emerald-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">{ordersReport?.Refunded}</p>
                  <p className="text-sm text-muted-foreground">Refunded</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Orders</h3>
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
                    <TableHead>Order Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                          <div>
                            ₹{order.item_total}
                            <div
                              className={`text-sm ${
                                order.payment_status == "Paid"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              ₹{order.payment_status}
                            </div>
                          </div>
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
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-sm rounded-md font-medium ${getStatusStyles(
                              order.order_status
                            )}`}
                          >
                            {order.order_status}
                          </span>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
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
