"use client";

import { useEffect, useState } from "react";
import {
  Search,
  FileDown,
  ChevronDown,
  FileBarChart,
  Clock,
  TruckIcon,
  XCircle,
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
import { useRouter } from "next/navigation";
import ProjectApiList from "../api/ProjectApiList";

export default function CampaignReportsPage() {
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

    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

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

  // ✅ Fetch all orders
  const fetchTotalOrders = async (page = 1, limit = 5) => {
    if (!restaurants_no) return;

    try {
      const response = await axios.get(
        `${apiGetAllOrdersForResturant}/${restaurants_no}?order_no=${searchOrderNo}&page=${page}&limit=${limit}`
      );
      setTotalOrders(response.data.data || []);
      setTotalPages(response.data.totalPages || 1); // Optional: if backend supports
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error fetching total orders:", err);
      setError("Failed to load total orders.");
    }
  };
   // ✅ Fetch when restaurant number is ready
  useEffect(() => {
    if (restaurants_no && !restaurantLoading) {
      fetchTotalOrders(currentPage);
    }
  }, [restaurants_no, restaurantLoading, timeFilter, currentPage]);

  useEffect(() => {
    if (restaurants_no) {
      fetchTotalOrders(1); // Reset to page 1 on search
    }
  }, [searchOrderNo]);

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
            <h1 className="text-xl font-semibold">
              Food Campaign   
            </h1>
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

              {/* <div className="ml-auto">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Filter
                </Button>
              </div> */}
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
                <p className="text-2xl font-bold">
                  {ordersReport?.AllOrders?.count}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Total orders
                </p>
                <p className="text-sm font-medium">
                  Total order Amount: Rs.{ordersReport?.AllOrders?.totalAmount}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-pink-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Processing}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    In progress orders
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <TruckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {ordersReport?.Food_on_the_way}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {ordersReport?.Delivered}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivered Orders
                  </p>
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
                  <p className="text-2xl font-bold">
                    {ordersReport?.Payment_Failed}
                  </p>
                  <p className="text-sm text-muted-foreground">Paymnt Failed</p>
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
                  <p className="text-2xl font-bold">{ordersReport?.Refunded}</p>
                  <p className="text-sm text-muted-foreground">
                    Refunded orders
                  </p>
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
                  <p className="text-2xl font-bold">{ordersReport?.Canceled}</p>
                  <p className="text-sm text-muted-foreground">
                    Canceled Orders
                  </p>
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
                  value={searchOrderNo}
                  onChange={(e) => setSearchOrderNo(e.target.value)}
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
                    {/* <TableHead>Payent Method</TableHead> */}
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
                              {order.payment_status}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell> ₹{order.discount}</TableCell>
                        <TableCell> ₹{order.discount}</TableCell>
                        <TableCell>{order.gst}%</TableCell>
                        <TableCell>
                          {order.delivery == null ? "NA" : order.delivery}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {order.packaging_charge
                            ? `₹${order.packaging_charge}`
                            : "-"}
                        </TableCell>

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
                        <TableCell>
                          {order?.amount_received_by ?? "-"}
                        </TableCell>
                        {/* <TableCell>{order.payment_method}</TableCell> */}
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-sm rounded-md font-medium ${getStatusStyles(
                              order.order_status
                            )}`}
                          >
                            {order.order_status.replace(/_/g, " ")}
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
               <div className="flex justify-end mt-4 gap-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  variant="outline"
                >
                  Previous
                </Button>

                {/* <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span> */}
                <Button
                  // disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
