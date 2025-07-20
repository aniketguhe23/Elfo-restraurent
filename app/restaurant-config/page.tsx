"use client";

import { useEffect, useState } from "react";
import { Settings, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/protected-route";
import axios from "axios";
import { toast } from "react-toastify";
import ProjectApiList from "../api/ProjectApiList";
import { Badge } from "@/components/ui/badge";
import { AddScheduleModal } from "@/components/restaurant-config/AddScheduleModal";
import EditScheduleModal from "@/components/restaurant-config/EditScheduleModal";
import { CreateGeneralSettingsModal } from "@/components/restaurant-config/CreateGeneralSettingsModal";
import { CreateRestaurantBasicSettingsModal } from "@/components/restaurant-config/CreateBasicSettingsModal";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { EditBasicSettingsModal } from "@/components/restaurant-config/EditBasicSettingsModal";

export default function RestaurantConfigPage() {
  const {
    apiGettResturantHours,
    apiCreateGeneralSettings,
    apiGetGeneralSettings,
    apiUpdateGeneralSettings,
    apiCreateBasicSettings,
    apiGetBasicSettings,
    apiUpdateBasicSettings,
    apiUpdateResturantStatus,
    apiGetResturantData,
  } = ProjectApiList();

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [resturantData, seResturantData] = useState<any>(null);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [basicSettings, setBasicSettings] = useState<any>(null);
  const [openBasicEditModal, setOpenBasicEditModal] = useState(false);
  const [editableBasic, setEditableBasic] = useState(basicSettings);

  const [loading, setLoading] = useState(true);
  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);
  const [settings, setSettings] = useState({
    scheduledDelivery: true,
    homeDelivery: true,
    veg: true,
    nonVeg: true,
    subscriptionBasedOrder: false,
    cutlery: true,
    instantOrder: true,
    takeAway: true,
    extraPackagingCharge: true,
    dineIn: true,
    tagStatus: true,
  });

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

  const fetchRestaurantHours = async () => {
    if (!restaurants_no) return;

    try {
      const res = await axios.get(`${apiGettResturantHours}/${restaurants_no}`);
      if (Array.isArray(res.data.data)) {
        setSchedules(res.data.data);
      } else {
        console.error("Unexpected response:", res.data);
        setSchedules([]);
      }
    } catch (err) {
      toast.error("Failed to load restaurant hours");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurants_no) return; // Skip if not ready
    fetchRestaurantHours();
  }, [restaurants_no]);

  // const handleGeneralSettingChange = async (key: string, value: boolean) => {
  //   const updatedSettings = { ...settings, [key]: value };
  //   setSettings(updatedSettings);

  //   try {
  //     await axios.post(apiCreateGeneralSettings, {
  //       restaurant_no: restaurants_no,
  //       scheduled_delivery: updatedSettings.scheduledDelivery,
  //       home_delivery: updatedSettings.homeDelivery,
  //       veg: updatedSettings.veg,
  //       non_veg: updatedSettings.nonVeg,
  //       subscription_based_order: updatedSettings.subscriptionBasedOrder,
  //       cutlery: updatedSettings.cutlery,
  //       instant_order: updatedSettings.instantOrder,
  //       take_away: updatedSettings.takeAway,
  //       dine_in: updatedSettings.dineIn,
  //       extra_packaging_charge: updatedSettings.extraPackagingCharge,
  //       tag_status: updatedSettings.tagStatus,
  //     });

  //     toast.success("General settings updated");
  //   } catch (error) {
  //     toast.error("Failed to update general settings");
  //     console.error("Update error:", error);
  //   }
  // };

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      if (!restaurants_no) return;

      try {
        const res = await axios.get(
          `${apiGetGeneralSettings}/${restaurants_no}`
        );
        const result = res.data.data[0];
        if (result) {
          setGeneralSettings(result);
        }
      } catch (error) {
        toast.error("Failed to fetch general settings");
      }
    };

    fetchGeneralSettings();
  }, [restaurants_no]);

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const updated = { ...generalSettings, [key]: value };
      setGeneralSettings(updated);

      await axios.put(`${apiUpdateGeneralSettings}/${restaurants_no}`, {
        ...updated,
      });

      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Failed to update setting");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!restaurants_no) return;
    const fetchBasicSettings = async () => {
      try {
        const response = await axios.get(
          `${apiGetBasicSettings}/${restaurants_no}`
        );
        setBasicSettings(response.data.data); // assuming response.data is the object
      } catch (error) {
        console.error("Failed to fetch basic settings", error);
      }
    };

    fetchBasicSettings();
  }, [restaurants_no]);

  useEffect(() => {
    setEditableBasic(basicSettings);
  }, [basicSettings]);

  const fetchResturantData = async () => {
    if (!restaurants_no) return;

    try {
      const res = await axios.get(`${apiGetResturantData}/${restaurants_no}`);
      const result = res.data.data;
      if (result) {
        seResturantData(result);
      }
    } catch (error) {
      toast.error("Failed to fetch general settings");
    }
  };

  useEffect(() => {
    fetchResturantData();
  }, [restaurants_no]);

  const updateBasicSettings = async (checked: boolean) => {
    const payload = {
      is_active: checked, // this reflects the new value
    };

    try {
      const response = await axios.put(
        `${apiUpdateResturantStatus}/${restaurants_no}`,
        payload
      );

      if (response.data?.status === "success") {
        fetchResturantData(); // refresh UI with updated state
        console.log("Basic settings updated successfully");
      } else {
        console.warn("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Failed to update basic settings:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <Settings className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Restaurant Config</h1>
          </div>
        </header>

        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">
                    Close Restaurant Temporarily
                  </span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Switch
                  checked={resturantData?.is_active === true}
                  onCheckedChange={updateBasicSettings}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="schedule">
                Restaurant Opening & Closing Schedules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>

                  <div className="mb-4 flex justify-end">
                    <Button onClick={() => setCreateModalOpen(true)}>
                      {generalSettings
                        ? "General Settings Created"
                        : "Create General Settings"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {generalSettings && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(generalSettings)
                        .filter(
                          ([key]) => key !== "restaurant_no" && key !== "id"
                        )
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span className="capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                            </div>
                            <Switch
                              checked={!!value}
                              onCheckedChange={(checked) =>
                                updateSetting(key, checked)
                              }
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Basic Settings
                  </CardTitle>
                </CardHeader>
                <div className="flex justify-end items-center">
                  {basicSettings ? (
                    <div className="flex justify-end mx-2">
                      <Button onClick={() => setOpenBasicEditModal(true)}>
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setBasicModalOpen(true)}>
                      {basicSettings
                        ? "Basic Settings Created"
                        : "Create Basic Settings"}
                    </Button>
                  )}
                </div>
                {basicSettings && (
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Packaging Charge Type</Label>
                        <Input
                          value={basicSettings.packaging_charge_type}
                          readOnly
                        />
                      </div>
                      <div>
                        <Label>Packaging Charge Amount</Label>
                        <Input
                          value={basicSettings.packaging_charge_amount}
                          readOnly
                        />
                      </div>
                      <div>
                        <Label>Minimum Order Amount</Label>
                        <Input
                          value={basicSettings.min_order_amount}
                          readOnly
                        />
                      </div>
                      <div>
                        <Label>Minimum Dine-In Time</Label>
                        <Input value={basicSettings.min_dinein_time} readOnly />
                      </div>
                      <div>
                        <Label>GST Enabled</Label> <br />
                        <Switch checked={basicSettings.gst_enabled} disabled />
                      </div>
                      <div>
                        <Label>GST Percentage</Label>
                        <Input value={basicSettings.gst_percentage} readOnly />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Cuisines</Label>
                        <Input value={basicSettings.cuisines} readOnly />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Tags</Label>
                        <Input value={basicSettings.tags} readOnly />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Restaurant Opening & Closing Schedules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <AddScheduleModal
                      restaurantNo={restaurants_no}
                      onSuccess={() => {
                        fetchRestaurantHours();
                      }}
                      onClose={() => {
                        fetchRestaurantHours();
                      }}
                    />
                    {selectedSchedule && (
                      <EditScheduleModal
                        open={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        onSuccess={() => {
                          fetchRestaurantHours();
                          setEditModalOpen(false);
                        }}
                        schedule={selectedSchedule}
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    {schedules.map((schedule: any, index) => (
                      <div key={schedule.weekday}>
                        <div className="flex items-center justify-between py-4">
                          <div className="font-medium">{schedule.weekday}:</div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Opening Time</span>
                              <Input
                                type="time"
                                value={schedule.opening_time}
                                className="w-32"
                                disabled={!schedule.editing}
                                onChange={(e) => {
                                  const newSchedules: any = [...schedules];
                                  newSchedules[index].opening_time =
                                    e.target.value;
                                  setSchedules(newSchedules);
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Closing Time</span>
                              <Input
                                type="time"
                                value={schedule.closing_time}
                                className="w-32"
                                disabled={!schedule.editing}
                                onChange={(e) => {
                                  const newSchedules: any = [...schedules];
                                  newSchedules[index].closing_time =
                                    e.target.value;
                                  setSchedules(newSchedules);
                                }}
                              />
                            </div>

                            <Badge
                              variant="outline"
                              className={
                                schedule.is_open
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : "bg-red-100 text-red-700 border-red-300"
                              }
                            >
                              {schedule.is_open ? "Open" : "Closed"}
                            </Badge>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setEditModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                        {index < schedules.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditBasicSettingsModal
        open={openBasicEditModal}
        setOpen={setOpenBasicEditModal}
        editableBasic={editableBasic}
        setEditableBasic={setEditableBasic}
        setBasicSettings={setBasicSettings}
        apiUpdateBasicSettings={apiUpdateBasicSettings}
      />

      {createModalOpen && (
        <CreateGeneralSettingsModal
          open={createModalOpen}
          alreadyCreated={!!generalSettings}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={async () => {
            setCreateModalOpen(false);
            try {
              const res = await axios.get(
                `${apiGetGeneralSettings}/${restaurants_no}`
              );
              setGeneralSettings(res.data.data);
            } catch (err) {
              toast.error("Failed to refresh settings");
            }
          }}
          apiCreateGeneralSettings={apiCreateGeneralSettings}
          restaurant_no={restaurants_no}
        />
      )}

      {basicModalOpen && (
        <CreateRestaurantBasicSettingsModal
          open={basicModalOpen}
          onClose={() => setBasicModalOpen(false)}
          onSuccess={() => {
            setBasicModalOpen(false);
            // fetchBasicSettings();
          }}
          apiCreateBasicSettings={apiCreateBasicSettings}
          restaurant_no={restaurants_no}
          alreadyCreated={!!basicSettings}
        />
      )}
    </ProtectedRoute>
  );
}
