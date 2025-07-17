"use client"

import { useState } from "react"
import { Settings, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ProtectedRoute } from "@/components/protected-route"

export default function RestaurantConfigPage() {
  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false)
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

  })

  const [basicSettings, setBasicSettings] = useState({
    extraPackagingCharge: "Continue",
    extraPackagingChargeAmount: "",
    minimumOrderAmount: "",
    minimumTimeForDineInOrder: "",
    gst: true,
    gstCharge: "",
    cuisin: "",
    tags: "",
  })

  const [schedules, setSchedules] = useState([
    { day: "Monday", openingTime: "10:00 AM", closingTime: "8:00 PM", isOpen: true },
    { day: "Tuesday", openingTime: "10:00 AM", closingTime: "8:00 PM", isOpen: true },
    { day: "Wednesday", openingTime: "10:00 AM", closingTime: "8:00 PM", isOpen: true },
  ])

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleBasicSettingChange = (key: string, value: string | boolean) => {
    setBasicSettings((prev) => ({ ...prev, [key]: value }))
  }

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
                  <span className="font-medium">Close Restaurant Temporarily</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Switch checked={isTemporarilyClosed} onCheckedChange={setIsTemporarilyClosed} />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="schedule">Restaurant Opening & Closing Schedules</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(settings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Switch checked={value} onCheckedChange={(checked) => handleSettingChange(key, checked)} />
                      </div>
                    ))}
                  </div>
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
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Extra Packaging Charge</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={basicSettings.extraPackagingCharge === "Continue" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleBasicSettingChange("extraPackagingCharge", "Continue")}
                        >
                          Continue
                        </Button>
                        <Button
                          variant={basicSettings.extraPackagingCharge === "Mandatory" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleBasicSettingChange("extraPackagingCharge", "Mandatory")}
                        >
                          Mandatory
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Extra Packaging Charge Amount</Label>
                      <Input
                        type="number"
                        placeholder="₹"
                        value={basicSettings.extraPackagingChargeAmount}
                        onChange={(e) => handleBasicSettingChange("extraPackagingChargeAmount", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Order Amount</Label>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={basicSettings.minimumOrderAmount}
                        onChange={(e) => handleBasicSettingChange("minimumOrderAmount", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Time For Dine In Order</Label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={basicSettings.minimumTimeForDineInOrder}
                        onChange={(e) => handleBasicSettingChange("minimumTimeForDineInOrder", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>GST</Label>
                        <Switch
                          checked={basicSettings.gst}
                          onCheckedChange={(checked) => handleBasicSettingChange("gst", checked)}
                        />
                      </div>
                    {/* </div> */}

                    {/* <div className="space-y-2"> */}
                      {/* <Label>Charge</Label> */}
                      <Input
                        type="number"
                        placeholder="2"
                        value={basicSettings.gstCharge}
                        onChange={(e) => handleBasicSettingChange("gstCharge", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cusisin</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={basicSettings.cuisin}
                        onChange={(e) => handleBasicSettingChange("cuisin", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={basicSettings.tags}
                        onChange={(e) => handleBasicSettingChange("tags", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
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
                  <div className="space-y-4">
                    {schedules.map((schedule, index) => (
                      <div key={schedule.day}>
                        <div className="flex items-center justify-between py-4">
                          <div className="font-medium">{schedule.day}:</div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Opening Time</span>
                              <Input
                                type="time"
                                value={schedule.openingTime}
                                className="w-32"
                                onChange={(e) => {
                                  const newSchedules = [...schedules]
                                  newSchedules[index].openingTime = e.target.value
                                  setSchedules(newSchedules)
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Closing Time</span>
                              <Input
                                type="time"
                                value={schedule.closingTime}
                                className="w-32"
                                onChange={(e) => {
                                  const newSchedules = [...schedules]
                                  newSchedules[index].closingTime = e.target.value
                                  setSchedules(newSchedules)
                                }}
                              />
                            </div>
                            <Switch
                              checked={schedule.isOpen}
                              onCheckedChange={(checked) => {
                                const newSchedules = [...schedules]
                                newSchedules[index].isOpen = checked
                                setSchedules(newSchedules)
                              }}
                            />
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
    </ProtectedRoute>
  )
}
