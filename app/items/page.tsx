"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectApiList from "../api/ProjectApiList";

// const restaurants_no = "RES-20250703-105200";

interface Item {
  id: number;
  name: string;
  image: string;
  category: string;
  is_available: boolean;
  prices: {
    small: number | null;
    medium: number | null;
    large: number | null;
  };
}

type GroupedItems = Record<string, Item[]>;

export default function RestaurantItemsPage() {
  const {
    apiGetResturantItems,
    apiGetResturantAllMenu,
    apiResturantItemsAssign,
  } = ProjectApiList();
  const [items, setItems] = useState<GroupedItems>({});
  const [menuOptions, setMenuOptions] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [menusLoading, setMenusLoading] = useState(true);
  const [restaurants_no, setResturantId] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("restaurant");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed?.restaurants_no) {
          setResturantId(parsed.restaurants_no);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage restaurant:", error);
    } finally {
      setRestaurantLoading(false); // Whether success or fail, we're done loading
    }
  }, []);

  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fetchItems = async () => {
    if (!restaurants_no) return; // 🚫 Don't run if it's null or undefined

    setItemsLoading(true);
    try {
      const res = await axios.get(
        `${apiGetResturantItems}/${restaurants_no}/items`
      );
      setItems(res.data?.data || {});
    } catch (error) {
      toast.error("Failed to load restaurant items");
      setItems({});
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchAllMenus = async () => {
    try {
      const res = await axios.get(`${apiGetResturantAllMenu}`);
      setMenuOptions(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch menu options");
    } finally {
      setMenusLoading(false);
    }
  };

  const handleAssignItem = async () => {
    // if (!selectedItemId) return toast.warning("Please select an item");
    setIsLoading(true);
    try {
      await axios.post(`${apiResturantItemsAssign}`, {
        restaurants_no: restaurants_no,
        item_ids: selectedItems,
      });
      toast.success("Item assigned successfully");

      setSelectedItemId(null);
      fetchItems();
    } catch (error) {
      toast.error("Failed to assign item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await axios.delete(
        `${apiGetResturantItems}/${restaurants_no}/item/${itemId}`
      );
      toast.success("Item removed");
      fetchItems();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const toggleAvailability = async (itemId: number, currentState: boolean) => {
    try {
      await axios.put(
        `${apiGetResturantItems}/${restaurants_no}/item/${itemId}`,
        { is_available: !currentState }
      );
      toast.success(
        `Item marked as ${!currentState ? "available" : "unavailable"}`
      );
      fetchItems(); // Refresh UI
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  useEffect(() => {
    if (restaurants_no) {
      fetchItems();
    }
  }, [restaurants_no]);

  useEffect(() => {
    fetchItems();
    fetchAllMenus();
  }, []);

  const confirmDeleteItem = (item: Item) => {
    setItemToDelete(item);
    setShowConfirmDialog(true);
  };

  const executeDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(
        `${apiGetResturantItems}/${restaurants_no}/item/${itemToDelete.id}`
      );
      toast.success("Item removed");
      fetchItems();
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setShowConfirmDialog(false);
      setItemToDelete(null);
    }
  };

  if (restaurantLoading) {
    return <div>Loading...</div>; // or <Skeleton className="h-8 w-full" />
  }

  if (!restaurants_no) {
    return <div>No restaurant selected</div>; // optional fallback
  }

  // ✅ Once loaded, render actual content
  // return <div>Restaurant ID: {restaurants_no}</div>;

  return (
    <>
      <header className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Settings className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Items </h1>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header + Add Item Dialog */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Items for Restaurant</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={menusLoading}>Add Items</Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Assign Menu Items</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Select Items</Label>

                {menusLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-3 border rounded-md p-2">
                    {/* ✅ Select All checkbox */}
                    <div className="flex items-center gap-2 border-b pb-2 mb-2">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length === menuOptions.length &&
                          menuOptions.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(
                              menuOptions.map((item) => item.id)
                            );
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                      />
                      <span className="text-sm font-medium">Select All</span>
                    </div>

                    {/* ✅ Item list */}
                    {menuOptions.map((item: any) => {
                      const isSelected = selectedItems.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 w-[450px] border-b pb-2 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={isSelected}
                            onChange={() => toggleItem(item.id)}
                          />
                          <div className="flex gap-3">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover border"
                            />
                            <div className="text-left space-y-0.5">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.category?.name} &mdash;{" "}
                                {item.subcategory?.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                              <span
                                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                                  item.is_available
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.is_available
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button
                  disabled={selectedItems.length === 0 || isLoading}
                  onClick={handleAssignItem}
                  className="w-full"
                >
                  {isLoading
                    ? "Assigning..."
                    : `Assign ${selectedItems.length} Item(s)`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Items Grouped by Category */}
        {itemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-0">
                  <Skeleton className="w-full h-40 rounded-t-xl" />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          Object.entries(items).map(([category, itemsInCategory]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold text-muted-foreground">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {itemsInCategory.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="p-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.is_available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">{item.category}</p>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant={item.is_available ? "secondary" : "outline"}
                          className="w-full"
                          onClick={() =>
                            toggleAvailability(item.id, item.is_available)
                          }
                        >
                          {item.is_available
                            ? "Mark as Unavailable"
                            : "Mark as Available"}
                        </Button>

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => confirmDeleteItem(item)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to remove{" "}
              <strong>{itemToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={executeDeleteItem}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
