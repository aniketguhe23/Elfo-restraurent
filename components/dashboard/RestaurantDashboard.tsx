"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Tooltip } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import ProjectApiList from "@/app/api/ProjectApiList";
import axios from "axios";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const topSellingItemsData = [
  { item: "Margherita Pizza", orders: 1250 },
  { item: "Chicken Burger", orders: 980 },
  { item: "Caesar Salad", orders: 875 },
  { item: "Pasta Carbonara", orders: 720 },
  { item: "Fish & Chips", orders: 650 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-2))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
  value: {
    label: "Average Order Value",
    color: "hsl(var(--chart-3))",
  },
  customers: {
    label: "Customers",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function RestaurantDashboard() {
  const {
    apigetTotalSalesChart,
    apigetTopSellingItems,
    apigetAverageOrderValue,
    apigetTopRestaurantsByOrders,
    apigetTotalCustomers,
    apigetSalesTypePieChart,
  } = ProjectApiList();

  const [activeFilter, setActiveFilter] = useState("all");
  const [salesReport, setSalesReport] = useState<any>({});
  // const [salesTypePieChart, setSalesTypePieChart] = useState<any>({});
  // const [totalCustomers, setTotalCustomers] = useState<any>();
  const [salesTypePieChart, setSalesTypePieChart] = useState<any>([]);
  const [totalCustomers, setTotalCustomers] = useState<any>([]);

  const [topRestaurantsByOrders, setTopRestaurantsByOrders] = useState<any>({});
  const [averageOrderValue, setAverageOrderValue] = useState<any>({});
  const [topSellingItems, setTopSellingItems] = useState<any>({});
  const [totalTopSellingItems, setTotalTopSellingItems] = useState<any>({});
  const [totalSalesReport, setTotalSalesReport] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState<DateRange>();
  const [startDate, setStartDate] = useState<string>(""); // for range.from
  const [endDate, setEndDate] = useState<string>(""); // for range.to
  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);

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

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);

    if (range?.from) {
      setStartDate(format(range.from, "yyyy-MM-dd"));
    } else {
      setStartDate("");
    }

    if (range?.to) {
      setEndDate(format(range.to, "yyyy-MM-dd"));
    } else {
      setEndDate("");
    }
  };

  useEffect(() => {
    if (!restaurants_no) return;

    const fetchOrdersReport = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTotalSalesChart}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurantId=${restaurants_no}`
        );
        setSalesReport(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersReport();
  }, [activeFilter, endDate, startDate, restaurants_no]);

  useEffect(() => {
    if (Array.isArray(salesReport) && salesReport.length > 0) {
      const totalSalesData = salesReport.map((entry) => ({
        period: entry.period,
        total_sales: Number(entry.total_sales),
      }));
      setTotalSalesReport(totalSalesData);
    }
  }, [salesReport]);

  useEffect(() => {
    if (!restaurants_no) return;

    const fetchTopSellingItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTopSellingItems}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurant_id=${restaurants_no}`
        );
        setTopSellingItems(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingItems();
  }, [activeFilter, endDate, startDate, restaurants_no]);

  useEffect(() => {
    if (Array.isArray(topSellingItems) && topSellingItems.length > 0) {
      const totalData = topSellingItems.map((entry) => ({
        item: entry.name,
        orders: Number(entry.sold),
      }));
      setTotalTopSellingItems(totalData);
    }
  }, [salesReport]);

  useEffect(() => {
    if (!restaurants_no) return;

    const fetchAverageOrderValue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetAverageOrderValue}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurant_id=${restaurants_no}`
        );
        setAverageOrderValue(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchAverageOrderValue();
  }, [activeFilter, endDate, startDate, restaurants_no]);

  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchTopResturent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTopRestaurantsByOrders}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurantId=`
        );
        setTopRestaurantsByOrders(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopResturent();
  }, [activeFilter, endDate, startDate]);

  useEffect(() => {
    // if (!restaurants_no) return;

    const fetchAverageOrderValue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetTotalCustomers}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurantId=`
        );
        setTotalCustomers(response.data.data || {}); // ✅ also set default to object
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchAverageOrderValue();
  }, [activeFilter, endDate, startDate]);

  useEffect(() => {
    if (!restaurants_no) return;
    const fetchSalesTypePieChart = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apigetSalesTypePieChart}?type=${activeFilter}&startDate=${startDate}&endDate=${endDate}&restaurant_id=${restaurants_no}`
        );
        setSalesTypePieChart(response.data.data || []);
      } catch (err: any) {
        console.error("Error fetching sales type pie chart:", err);
        setError("Failed to load sales type pie chart.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesTypePieChart();
  }, [activeFilter, endDate, startDate, restaurants_no]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            {/* <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Restaurant Analytics</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Comprehensive insights into your restaurant performance
            </p> */}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Tabs
              value={activeFilter}
              onValueChange={setActiveFilter}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="text-xs lg:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs lg:text-sm">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs lg:text-sm">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs lg:text-sm">
                  Yearly
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-auto justify-start text-left font-normal bg-transparent text-xs lg:text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <span className="hidden sm:inline">
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </span>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Total Sales - Line Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl">
                Total Sales Over Time
              </CardTitle>
              <CardDescription className="text-sm">
                Monthly sales performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ChartContainer
                config={chartConfig}
                className="h-[250px] lg:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={totalSalesReport}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />

                    <XAxis
                      dataKey="period"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `₹${value.toLocaleString("en-IN")}`
                      }
                    />

                    <Tooltip
                      contentStyle={{ fontSize: "12px" }}
                      formatter={(value: number) =>
                        `₹${value.toLocaleString("en-IN")}`
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="total_sales"
                      stroke="var(--color-sales)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-sales)", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Order Types - Pie Chart */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl">Order Types</CardTitle>
              <CardDescription className="text-sm">
                Distribution by service type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ChartContainer
                config={chartConfig}
                className="h-[250px] lg:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`${value} `, "Value"]}
                      // formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Pie
                      data={salesTypePieChart}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      dataKey="value"
                      label={({ type, value }) => `${type}: ${value}%`}
                      labelLine={false}
                      fontSize={12}
                    >
                      {salesTypePieChart.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Selling Items - Vertical Bar Chart */}
          <Card className="col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl">
                Top Selling Items
              </CardTitle>
              <CardDescription className="text-sm">
                Most ordered items by quantity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ChartContainer
                config={chartConfig}
                className="h-[250px] lg:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={totalTopSellingItems}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="item"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(1)}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`${value} `, "Orders"]}
                    />
                    <Bar
                      dataKey="orders"
                      fill="var(--color-orders)"
                      radius={[4, 4, 0, 0]}
                    >
                      {topSellingItemsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Average Order Value - Area Chart */}
          <Card className="col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl">
                Average Order Value
              </CardTitle>
              <CardDescription className="text-sm">
                Monthly AOV trends
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ChartContainer
                config={chartConfig}
                className="h-[250px] lg:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={averageOrderValue}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`₹${value} `, "AOV"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      fill="var(--color-value)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Restaurants - Bar Chart */}
          {/* <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl">
                Top Restaurants
              </CardTitle>
              <CardDescription className="text-sm">
                By order volume
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ChartContainer
                config={chartConfig}
                className="h-[250px] lg:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topRestaurantsByOrders}
                    margin={{ top: 5, right: 10, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="restaurant"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`${value}`, "Orders"]}
                    />
                    <Bar
                      dataKey="orders"
                      fill="var(--color-orders)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card> */}

          {/* Total Customers - Line Chart */}
          <Card className="col-span-3">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl">
                Total Customers
              </CardTitle>
              <CardDescription className="text-sm">
                Monthly customer growth
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ChartContainer
                config={chartConfig}
                className="h-[250px] lg:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={totalCustomers}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(1)}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`${value} `, "Customers"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="var(--color-customers)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-customers)",
                        strokeWidth: 2,
                        r: 3,
                      }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
