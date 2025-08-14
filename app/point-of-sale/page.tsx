"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { ProtectedRoute } from "@/components/protected-route";
import axios from "axios";
import ProjectApiList from "../api/ProjectApiList";
import { toast } from "react-toastify";
import LoginModal from "../customer-login/login/LoginModal";
import CreateAccountModal from "../customer-login/createAccount/CreateAccountModal";

type CartItem = {
  type: "preset";
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  dough: string;
  crust: string;
  toppings: string[];
  suggestions: string[];
};

export default function PointOfSalePage() {
  const {
    api_getToppings,
    apiGetResturantItems,
    apiGetBasicSettings,
    apigetUserDataByMob,
    api_createOrder,
  } = ProjectApiList();

  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([
    "All Categories",
  ]);
  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurants_address, setResturant_address] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [userData, setUserData] = useState<any>([]);
  const [resturantBasicSettings, setResturantBasicSettings] = useState<any>([]);
  const [showModeModal, setShowModeModal] = useState(false);
  const [orderMode, setOrderMode] = useState<"delivery" | "pickup" | "">("");
  const [pendingItem, setPendingItem] = useState<any>(null); // item waiting for mode
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "card">("COD");
  const [toppings, setToppingData] = useState<string[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerMobile, setCustomerMobile] = useState("");
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [orderResponse, setOrderResponse] = useState<any>({});

  const [selectedSize, setSelectedSize] = useState<string>("small");
  const [selectedDough, setSelectedDough] = useState<string>("classic");
  const [selectedCrust, setSelectedCrust] = useState<string>("normal");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [createAccountData, setCreateAccountData] = useState<{
    waId: string;
    mobile: string;
  } | null>(null);

  // console.log(orderResponse);
  // console.log(selectedCustomer?.waId);

  const addToCart = (
    item: { id: number; name: string; price: number },
    size: string
  ) => {
    const key = `${item.id}-${item.name}-${size}`;
    const existingItem = cart.find(
      (cartItem) => `${cartItem.id}-${cartItem.name}-${cartItem.size}` === key
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          `${cartItem.id}-${cartItem.name}-${cartItem.size}` === key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      const fullItem: CartItem = {
        type: "preset",
        id: String(item.id),
        name: item.name,
        price: item.price,
        quantity: 1,
        size,
        dough: "classic", // default dough
        crust: "normal", // default crust
        toppings: [],
        suggestions: [],
      };

      setCart([...cart, fullItem]);
    }
  };

  const removeFromCart = (id: number, name: string) => {
    const key = `${id}-${name}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => `${item.id}-${item.name}` === key
      );

      if (!existingItem) return prevCart;

      if (existingItem.quantity > 1) {
        return prevCart.map((item) =>
          `${item.id}-${item.name}` === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => `${item.id}-${item.name}` !== key);
      }
    });
  };

  const clearCart = () => setCart([]);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("restaurant");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed?.restaurants_no) {
          setResturant_no(parsed.restaurants_no);
        }
        if (parsed.address) {
          setResturant_address(parsed.address);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage restaurant:", error);
    } finally {
      setRestaurantLoading(false);
    }
  }, []);

 useEffect(() => {
  const fetchToppings = async () => {
    try {
      const formattedSize =
        selectedSize.charAt(0).toUpperCase() +
        selectedSize.slice(1).toLowerCase();

      const response = await axios.get(
        `${api_getToppings}?pizza_size=${formattedSize}`
      );
      const data = response?.data?.data || {};
      setToppingData(data);
    } catch (error) {
      console.error("Error fetching topping data:", error);
    }
  };

  fetchToppings();
}, [api_getToppings, selectedSize]);


  const fetchResturentItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiGetResturantItems}/${restaurants_no}/items`
      );
      const { data } = response.data;
      setItems(data || []);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurants_no && !restaurantLoading) {
      fetchResturentItems();
    }
  }, [restaurants_no, restaurantLoading]);

  useEffect(() => {
    const allCategories = ["All Categories", ...Object.keys(items)];
    const areSame =
      dynamicCategories.length === allCategories.length &&
      dynamicCategories.every((value, index) => value === allCategories[index]);

    if (!areSame) {
      setDynamicCategories(allCategories);
    }
  }, [items]);

  const handleItemClick = (item: any) => {
    if (!orderMode) {
      toast.error("❌ Please choose Order Type first.");
      return;
    }

    const validPrices = Object.entries(item.prices).filter(
      ([, value]) => value !== null
    );

    if (validPrices.length <= 1) {
      const size = validPrices[0]?.[0] || "small";
      const price: any = validPrices[0]?.[1] || 0;
      addToCart({ id: item.id, name: item.name, price }, size);
    } else {
      setSelectedItem(item);
      setShowPriceModal(true);
    }
  };

  const getResturantBasicSettings = async () => {
    try {
      const res = await axios.get(`${apiGetBasicSettings}/${restaurants_no}`);
      const basicSettingData = res.data.data;
      setResturantBasicSettings(basicSettingData);
    } catch (err) {
      toast.error("❌ Failed to fetch suggestions. Please try again.");
      console.error("Suggestion fetch failed:", err);
    }
  };

  useEffect(() => {
    if (restaurants_no) {
      getResturantBasicSettings();
    }
  }, [restaurants_no]);

  const getUserData = async (mobile: string) => {
    try {
      setSearching(true);
      const res = await axios.get(`${apigetUserDataByMob}/${mobile}`);
      const userData = res.data.user;
      setSearchedUser(userData);
      toast.success("✅ User found!");
    } catch (err) {
      setSearchedUser(null);
      toast.error("❌ No Customer found");
      console.error("Suggestion fetch failed:", err);
    } finally {
      setSearching(false);
    }
  };

  // useEffect(() => {
  //   getUserData();
  // }, []);

  const getGSTPercentage = () =>
    Number(resturantBasicSettings?.gst_percentage || 0);
  const getPackagingCharge = () => {
    if (orderMode === "delivery") {
      return Number(resturantBasicSettings?.packaging_charge_amount || 0);
    }
    return 0;
  };

  const subtotal = useMemo(() => calculateTotal(), [cart]);
  const gstAmount = useMemo(
    () => (subtotal * getGSTPercentage()) / 100,
    [subtotal]
  );
  const packagingCharge = useMemo(() => getPackagingCharge(), [orderMode]);
  const grandTotal = useMemo(
    () => subtotal + gstAmount + packagingCharge,
    [subtotal, gstAmount, packagingCharge]
  );

  // const basePrice = selectedItem.prices[selectedSize] || 0;
  // const toppingsPrice = selectedToppings.reduce((sum, toppingName) => {
  //   const topping = toppings.find((t: any) => t.name === toppingName);
  //   return sum + (topping?.price || 0);
  // }, 0);

  // const totalPrice = basePrice + toppingsPrice;

  const handlePlaceOrder = async () => {
    if (!selectedCustomer?.waId) {
      toast.error("❌ Please select Customer First");
      return;
    }
    if (!cart || cart.length === 0) {
      toast.error("❌ Please select Items First");
      return;
    }

    const gstPercentage = getGSTPercentage();
    const itemTotal = subtotal;
    const total = grandTotal;
    const discount = 0;

    const mergedItems = cart.map((item) => ({
      type: item.type,
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      dough: item.dough,
      crust: item.crust,
      toppings: item.toppings,
      suggestions: item.suggestions,
    }));

    const payload = {
      user_id: selectedCustomer?.waId || null,
      address: restaurants_address,
      restaurant_name: restaurants_no,
      type: orderMode,
      items: mergedItems,
      discount: Math.round(discount),
      delivery: null,
      payment_method: paymentMethod,
      payment_status: "Unpaid",
      gst: gstPercentage,
      packaging_charge:
        orderMode === "delivery"
          ? Number(resturantBasicSettings?.packaging_charge_amount)
          : 0,
      item_total: Math.round(itemTotal),
      total_price: Math.round(total).toFixed(2),
      points: Math.floor(itemTotal / 200),
    };

    // console.log(payload);

    try {
      const res = await axios.post(api_createOrder, payload);
      setOrderResponse(res?.data?.data);
      setShowSuccessModal(true); // Show success modal
      clearCart(); // Clear cart after success
    } catch (err) {
      toast.error("❌ Failed to place the order. Please try again.");
      console.error("Order placement failed:", err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  // for item modal category

  const hideOptions = ["DRINKS", "DESSERTS"].includes(selectedItem?.category);

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <header className="flex justify-between border-b bg-background sticky top-0 z-20">
          <div className="flex h-16 items-center px-4 gap-4">
            <ShoppingBag className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Point Of Sale</h1>
          </div>
          <div className="flex h-16 items-center px-4 gap-4">
            <Button
              onClick={() => {
                setShowModeModal(true);
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Order Type
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <div className="md:w-2/3 p-4 border-r overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Food Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dynamicCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Ex: Search food name"
                      className="pl-8"
                    />
                  </div>
                </div>

                {Object.entries(items)
                  .filter(
                    ([categoryName]) =>
                      selectedCategory === "All Categories" ||
                      selectedCategory === categoryName
                  )
                  .map(([categoryName, itemsArray]: [string, any[]]) => (
                    <div key={categoryName} className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">
                        {categoryName}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {itemsArray.map((item) => {
                          const price =
                            item?.prices?.small ??
                            item?.prices?.medium ??
                            item?.prices?.large ??
                            0;

                          const isAvailable = item?.is_available;
                          const isInCart = cart.some(
                            (cartItem) => cartItem.id === item.id
                          );

                          const handleClick = () => {
                            if (!isAvailable) return;

                            if (isInCart) {
                              toast.info("Item is already in the cart");
                              return;
                            }

                            handleItemClick(item);
                          };

                          return (
                            <div
                              key={item.id}
                              onClick={handleClick}
                              className={`relative rounded-lg border p-4 shadow-sm transition-all ${
                                isAvailable
                                  ? "cursor-pointer bg-white hover:shadow-md"
                                  : "cursor-not-allowed bg-gray-100 opacity-60"
                              }`}
                            >
                              {isInCart && (
                                <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-blue-500 text-white">
                                  In Cart
                                </div>
                              )}

                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-32 object-cover rounded-md mb-2"
                              />
                              <h3 className="text-md font-semibold">
                                {item.name}
                              </h3>

                              {/* Prices */}
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                {Object.entries(item.prices).map(
                                  ([size, price]: any) =>
                                    price !== null ? (
                                      <div
                                        key={size}
                                        className="flex justify-between"
                                      >
                                        <span className="capitalize">
                                          {size}
                                        </span>
                                        <span className="font-medium">
                                          ₹{price}
                                        </span>
                                      </div>
                                    ) : null
                                )}
                              </div>

                              {/* Badge */}
                              <div
                                className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
                                  isAvailable ? "bg-green-500" : "bg-red-500"
                                } text-white`}
                              >
                                {isAvailable ? "Available" : "Not Available"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/3 p-4 overflow-auto">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Billing Section</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex gap-4 mb-4">
                  {selectedCustomer ? (
                    <div className="bg-gray-100 p-4 rounded space-y-2 text-sm mb-4 w-full">
                      <p>
                        <strong>Name:</strong> {selectedCustomer.firstName}{" "}
                        {selectedCustomer.lastName}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {selectedCustomer.mobile}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedCustomer.email || "N/A"}
                      </p>
                      <p>
                        <strong>Resturant Addresses:</strong>
                      </p>

                      <ul className="list-disc list-inside">
                        {restaurants_address}
                      </ul>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCustomerModal(true)}
                          className="w-full"
                        >
                          Change Customer
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(null);
                            toast.success("❌ Customer removed");
                          }}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomerModal(true)}
                    >
                      Search Customer
                    </Button>
                  )}
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-2">Item</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 text-center text-sm text-muted-foreground"
                          >
                            Cart is empty. <br /> Please select items from the
                            food section.
                          </td>
                        </tr>
                      ) : (
                        cart.map((item: any) => (
                          <tr
                            key={`${item.id}-${item.name}`}
                            className="border-t"
                          >
                            <td className="py-2">{item.name}</td>
                            <td className="py-2 text-center">
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  disabled={item.quantity <= 1}
                                  className={`h-6 w-6 rounded-full bg-transparent ${
                                    item.quantity <= 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    removeFromCart(item.id, item.name)
                                  }
                                >
                                  -
                                </Button>
                                <span className="mx-2">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 rounded-full bg-transparent"
                                  onClick={() =>
                                    addToCart(
                                      {
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                      },
                                      item.size
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="py-2 text-right">
                              ₹ {item.price * item.quantity}
                            </td>
                            <td className="py-2 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500"
                                onClick={() =>
                                  setCart(
                                    cart.filter(
                                      (cartItem) =>
                                        `${cartItem.id}-${cartItem.name}` !==
                                        `${item.id}-${item.name}`
                                    )
                                  )
                                }
                              >
                                ×
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST ({getGSTPercentage()}%):</span>
                    <span>₹ {gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Packaging Charges
                      {orderMode === "pickup" ? " (Not applicable)" : ""}
                    </span>

                    <span>₹ {packagingCharge.toFixed(2)}</span>
                  </div>

                  {orderMode && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Order Mode:</strong> {orderMode.toUpperCase()}
                    </div>
                  )}

                  {/* <div className="flex justify-between">
    <span>Service Charge:</span>
    <span>₹ {calculateServiceCharge().toFixed(2)}</span>
  </div> */}

                  <div className="flex justify-between font-bold border-t pt-2 text-base">
                    <span>Total:</span>
                    <span>₹ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 font-medium">Paid by</p>
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      className={`flex-1 ${
                        paymentMethod === "COD"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-gray-100 text-black"
                      }`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      Cash
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex-1 ${
                        paymentMethod === "card"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      Card
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={() => {
                        if (!selectedCustomer?.waId) {
                          toast.error("❌ Please select Customer First");
                          return;
                        }
                        if (!cart || cart.length === 0) {
                          toast.error("❌ Please select Items First");
                          return;
                        }
                        setShowConfirmModal(true); // open confirmation modal
                      }}
                    >
                      Place Order
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showLoginModal && (
          <LoginModal
            setShowLoginModal={setShowLoginModal}
            onTriggerCreateAccount={(data) => {
              setShowLoginModal(false);
              setCreateAccountData(data); // or any logic
            }}
            onClose={() => setShowLoginModal(false)}
          />
        )}

        {createAccountData && (
          <CreateAccountModal
            onClose={() => setCreateAccountData(null)}
            waId={createAccountData.waId}
            mobile={createAccountData.mobile}
          />
        )}

        {showCustomerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setCustomerMobile("");
                  setSearchedUser(null);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>

              <h2 className="text-lg font-bold mb-4 text-center">
                Search Customer
              </h2>

              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter mobile number"
                value={customerMobile}
                maxLength={15}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setCustomerMobile(value);
                  }
                }}
              />

              <Button
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  if (
                    !customerMobile ||
                    customerMobile.length < 7 ||
                    customerMobile.length > 15 ||
                    !/^\d+$/.test(customerMobile)
                  ) {
                    toast.error(
                      "❌ Enter a valid mobile number (7–15 digits)."
                    );
                    return;
                  }

                  getUserData(customerMobile);
                }}
                disabled={searching}
              >
                {searching ? "Searching..." : "Search"}
              </Button>

              {searchedUser ? (
                <div className="mt-4 bg-gray-100 p-4 rounded space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {searchedUser.firstName}{" "}
                    {searchedUser.lastName}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {searchedUser.mobile}
                  </p>
                  <p>
                    <strong>Email:</strong> {searchedUser.email || "N/A"}
                  </p>
                  {/* <p>
                    <strong>Addresses:</strong>
                  </p>
                  {searchedUser?.addresses?.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {searchedUser.addresses.map(
                        (addr: string, idx: number) => (
                          <li key={idx}>{addr}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No addresses found</p>
                  )} */}

                  <Button
                    className="mt-2 w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedCustomer(searchedUser);
                      // setSelectedAddress(searchedUser?.addresses?.[0] || null);
                      setShowCustomerModal(false);
                      toast.success("✅ Customer selected");
                    }}
                  >
                    Select this Customer
                  </Button>
                </div>
              ) : (
                <Button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login new Customer
                </Button>
              )}
            </div>
          </div>
        )}

        {/* item Modal */}
        {showPriceModal && selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
              <h2 className="text-lg font-semibold mb-4">
                {selectedItem.name}
              </h2>

              <div className="space-y-4">
                {/* Size Selection */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Size</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {Object.entries(selectedItem.prices).map(
                      ([size, price]: any) =>
                        price !== null ? (
                          <option key={size} value={size}>
                            {size.charAt(0).toUpperCase() + size.slice(1)} - ₹
                            {price}
                          </option>
                        ) : null
                    )}
                  </select>
                </div>

                {/* Dough Selection */}
                {!hideOptions && (
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Dough
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedDough}
                      onChange={(e) => setSelectedDough(e.target.value)}
                    >
                      <option value="original">Original Dough</option>
                      <option value="sour">Sour Dough</option>
                    </select>
                  </div>
                )}

                {/* Crust Selection */}
                {!hideOptions && (
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Crust
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedCrust}
                      onChange={(e) => setSelectedCrust(e.target.value)}
                    >
                      <option value="original">Original Crust</option>
                      <option value="garlic">Garlic Crust</option>
                    </select>
                  </div>
                )}

                {/* Toppings Selection */}
                {!hideOptions && (
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Toppings
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {toppings?.map((topping: any) => (
                        <button
                          key={topping?.id}
                          type="button"
                          className={`px-3 py-1 border rounded-full ${
                            selectedToppings.includes(topping?.name)
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedToppings((prev) =>
                              prev.includes(topping?.name)
                                ? prev.filter((t) => t !== topping?.name)
                                : [...prev, topping?.name]
                            );
                          }}
                        >
                          {topping?.name}
                          <br />
                          <span className="text-xs"> {topping?.regular_price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border rounded px-3 py-2"
                    value={selectedQuantity}
                    onChange={(e) =>
                      setSelectedQuantity(Number(e.target.value))
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={() => {
                    const basePrice = selectedItem.prices[selectedSize] || 0;
                    const toppingsPrice = hideOptions
                      ? 0
                      : selectedToppings.reduce((sum, toppingName) => {
                          const topping: any = toppings.find(
                            (t: any) => t.name === toppingName
                          );
                          return sum + Number(topping?.regular_price || 0);
                        }, 0);

                    const totalPrice = basePrice + toppingsPrice;

                    const newItem: CartItem = {
                      type: "preset",
                      id: selectedItem.id,
                      name: selectedItem.name,
                      price: totalPrice,
                      size: selectedSize,
                      dough: hideOptions ? "" : selectedDough,
                      crust: hideOptions ? "" : selectedCrust,
                      toppings: hideOptions ? [] : selectedToppings,
                      suggestions: [],
                      quantity: selectedQuantity,
                    };

                    setCart([...cart, newItem]);
                    setShowPriceModal(false);
                    setSelectedItem(null);
                  }}
                >
                  Add to Cart
                </Button>
              </div>

              {/* Close Modal */}
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => {
                  setShowPriceModal(false);
                  setSelectedItem(null);
                }}
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {showModeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              {/* ❌ Close Button */}
              <button
                onClick={() => setShowModeModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                &times;
              </button>

              <h2 className="text-lg font-bold mb-4 text-center">
                Choose Order Mode
              </h2>

              <div className="space-y-3">
                {["delivery", "pickup"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setOrderMode(mode as any);
                      setShowModeModal(false);

                      if (pendingItem) {
                        const validPrices = Object.entries(
                          pendingItem.prices
                        ).filter(([, value]) => value !== null);
                        if (validPrices.length <= 1) {
                          const size = validPrices[0]?.[0] || "small";
                          const price: any = validPrices[0]?.[1] || 0;
                          addToCart(
                            {
                              id: pendingItem.id,
                              name: pendingItem.name + ` (${size})`,
                              price,
                            },
                            size
                          );
                        } else {
                          setSelectedItem(pendingItem);
                          setShowPriceModal(true);
                        }
                        setPendingItem(null);
                      }
                    }}
                    className="w-full py-2 px-4 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                  >
                    {mode === "delivery"
                      ? "Delivery"
                      : mode === "pickup"
                      ? "Pickup"
                      : "Dine-in"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">
                Confirm Order
              </h2>
              <p className="text-sm mb-6 text-center">
                Are you sure you want to place this order of{" "}
                <strong>₹{grandTotal.toFixed(2)}</strong>?
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handlePlaceOrder}
                >
                  Yes, Place Order
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && orderResponse?.Order_no && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative text-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-2 text-green-600">
                ✅ Order Placed!
              </h2>
              <p className="text-sm pb-2">Your Order Number is</p>

              {/* <p className="text-xl font-bold mt-2">{orderResponse.Order_no}</p> */}

              <Link
                href={`/orders/orderById?order_no=${orderResponse.Order_no}`}
                className="text-xl mt-2 font-medium text-blue-600 hover:underline"
              >
                <p>{orderResponse.Order_no}</p>
              </Link>
              <Button
                className="mt-6 bg-orange-500 hover:bg-orange-600"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
