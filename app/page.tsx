"use client";

import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileBarChart,
  Home,
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

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <header className="border-b bg-background sticky top-0 z-20">
          <div className="flex h-16 items-center px-4 gap-4">
            <Home className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] lg:w-[300px] pl-8"
                />
              </div>
              {/* <Select defaultValue="en">
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="EN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="fr">FR</SelectItem>
                  <SelectItem value="es">ES</SelectItem>
                </SelectContent>
              </Select> */}
              <Button variant="outline" size="sm">
                Harry Potter
                {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
              </Button>
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
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
                  {/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
                </TabsList>
                <div className="ml-auto">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Order statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                          <ClipboardCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">1</p>
                          <p className="text-sm text-muted-foreground">
                            Confirmed
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
                          <p className="text-2xl font-bold">0</p>
                          <p className="text-sm text-muted-foreground">
                            Cooking
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
                          <p className="text-2xl font-bold">1</p>
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
                          <p className="text-2xl font-bold">1</p>
                          <p className="text-sm text-muted-foreground">
                            Food on the way
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
                        <p className="text-sm">Delivered</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        1
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
                        0
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm">Scheduled</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        1
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm">All</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        20
                      </Badge>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Yearly statistics
                      </CardTitle>
                    </div>
                    <div className="ml-auto text-sm">
                      <span className="font-medium">Commission given: </span>
                      <span>Rs. 0.00</span>
                      <span className="ml-4 font-medium">Total earning: </span>
                      <span>Rs. 0.00</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <YearlyChart />
                  </CardContent>
                </Card>
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
    </ProtectedRoute>
  );
}
