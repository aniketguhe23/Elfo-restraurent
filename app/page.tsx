"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileBarChart,
  Home,
  RefreshCcw,
  Search,
  TruckIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YearlyChart } from "@/components/yearly-chart";
import { ProtectedRoute } from "@/components/protected-route";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProjectApiList from "./api/ProjectApiList";
import RestaurantDashboard from "@/components/dashboard/RestaurantDashboard";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { apiOrderReportofResturant } = ProjectApiList();
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState("all");
  const [refreshToggle, setRefreshToggle] = useState(false);

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
  }, [restaurants_no, apiOrderReportofResturant, timeFilter, refreshToggle]);

  return (
    <ProtectedRoute>
      <Button
        onClick={() => setRefreshToggle((prev) => !prev)}
        className="fixed top-1/2 right-1 z-50 transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-4"
      >
        <RefreshCcw className="h-5 w-5" />
      </Button>

      <div className="flex flex-col">
        <header className="border-b bg-background sticky top-0 z-20">
          <div className="flex h-16 items-center px-4 gap-4">
            <Home className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="ml-auto flex items-center gap-4">
              {/* <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] lg:w-[300px] pl-8"
                />
              </div> */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="grid gap-4 md:gap-8">
            <Tabs
              defaultValue="overview"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <div className="flex items-center mb-5">
                <h2 className="text-xl font-semibold">Order statistics</h2>
                {/* <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList> */}
                <div className="ml-auto">
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

              <TabsContent value="overview" className="space-y-4">
                <div>
                  {/* <h2 className="text-xl font-semibold mb-4">
                    Order statistics
                  </h2> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                          <FileBarChart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {ordersReport?.Pending}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            New Orders
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                          <ClipboardCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {ordersReport?.Confirmed}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Confirmed Order
                          </p>
                        </div>
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
                            Processing Order
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-amber-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                          <ClipboardList className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {ordersReport?.Ready_For_Delivery}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ready for delivery
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                          <TruckIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {ordersReport?.Food_on_the_way}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Food on the way
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
                          <p className="text-sm text-muted-foreground">
                            Delivered
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-4 mt-4">
                    <div className="flex items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                        <ClipboardCheck className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm">Delivered Orders</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {ordersReport?.Delivered}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <FileBarChart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm">Refunded</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {ordersReport?.Refunded}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm">Scheduled Orders</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {ordersReport?.Scheduled}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm">All Orders</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {ordersReport?.AllOrders?.count}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Analytics content will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Reports content will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <RestaurantDashboard />
    </ProtectedRoute>
  );
}
