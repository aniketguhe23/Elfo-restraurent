"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  FileDown,
  ChevronDown,
  ClipboardList,
  Trash,
  FileText,
  Eye,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { ProtectedRoute } from "@/components/protected-route";
import ProjectApiList from "../api/ProjectApiList";
import { useRouter } from "next/navigation";

const ORDER_STATUS_OPTIONS = [
  "All",
  "Pending",
  "Confirmed",
  "Processing",
  "Ready For Delivery",
  "Food On The Way",
  "Delivered",
  "Refunded",
  "Cancelled",
  "Cancelled_By_Customer",
   // "Accepted",
  // "Cooking",
  // "Dine In",
  // "Refunded Requested",
  // "Scheduled",
  // "Payment Failed",
];

export default function OrdersPage() {
  const { apiGetAllOrdersForResturant } = ProjectApiList();
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // Set default limit per page
  const [totalPages, setTotalPages] = useState(1);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(false);
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiGetAllOrdersForResturant}/${restaurants_no}?order_no=${searchOrderNo}&page=${page}&limit=${limit}`
      );
      const { data, total } = response.data;

      setOrders(data || []);
      setTotalPages(Math.ceil(total / limit));
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurants_no && !restaurantLoading) {
      fetchOrders();
    }
  }, [restaurants_no, restaurantLoading, searchOrderNo, page, limit]);

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
                <Input
                  type="search"
                  placeholder="Ex: Search Order No"
                  className="w-[200px] lg:w-[300px] pl-8"
                  value={searchOrderNo}
                  onChange={(e) => setSearchOrderNo(e.target.value)}
                />
              </div>
              <div className="min-w-[200px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-gray-600">Loading orders...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : orders.length === 0 ? (
                <div className="p-4 text-gray-500">No orders found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">SI</TableHead>
                      <TableHead>Order No</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Customer Info</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter((order) =>
                        selectedStatus === "All"
                          ? true
                          : order.order_status === selectedStatus
                      )
                      .map((order, index) => (
                        <TableRow key={order.Order_no}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{order.Order_no}</TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div>{order?.userInfo?.firstName}</div>
                            <div className="text-sm text-muted-foreground">
                              {order?.userInfo?.mobile}
                            </div>
                          </TableCell>
                          <TableCell>
                            ₹{order?.total_price}
                            <div
                              className={`text-sm font-medium ${
                                order?.payment_status === "Paid"
                                  ? "text-green-600"
                                  : order?.payment_status === "Unpaid"
                                  ? "text-red-600"
                                  : order?.payment_status === "Refunded"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {order?.payment_status?.charAt(0).toUpperCase() +
                                order?.payment_status?.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {order.order_status.replace(/_/g, " ")}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {/* {order?.type} */}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {/* View Button */}
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}

              <div className="flex justify-between items-center p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
