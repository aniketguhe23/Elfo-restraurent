"use client"

import { useState } from "react"
import { Search, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

const foodItems = [
  {
    id: 1,
    name: "Paneer Pizza",
    price: 599,
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 499,
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 3,
    name: "Garlic Bread",
    price: 199,
    image: "/placeholder.svg?height=150&width=150",
  },
]

const categories = ["All Categories", "Pizza", "Sides", "Beverages", "Desserts"]

export default function PointOfSalePage() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const addToCart = (item: { id: number; name: string; price: number }) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (id: number) => {
    const existingItem = cart.find((item) => item.id === id)

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCart(cart.filter((item) => item.id !== id))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateServiceCharge = () => {
    return 10.0
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <header className="border-b bg-background sticky top-0 z-20">
          <div className="flex h-16 items-center px-4 gap-4">
            <ShoppingBag className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Point Of Sale</h1>
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Ex: Search food name" className="pl-8" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {foodItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(item)}
                    >
                      <div className="aspect-square relative">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-orange-500">₹ {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Walk In Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk-in">Walk In Customer</SelectItem>
                      <SelectItem value="registered">Registered Customer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-orange-500 hover:bg-orange-600">Add New Customer</Button>
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
                      {cart.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full bg-transparent"
                                onClick={() => removeFromCart(item.id)}
                              >
                                -
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full bg-transparent"
                                onClick={() => addToCart(item)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="py-2 text-right">₹ {item.price * item.quantity}</td>
                          <td className="py-2 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={() => setCart(cart.filter((cartItem) => cartItem.id !== item.id))}
                            >
                              ×
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Addon:</span>
                    <span>₹ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹ {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>₹ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₹ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Discount:</span>
                    <span>₹ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vat/Tax:</span>
                    <span>₹ 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge:</span>
                    <span>₹ {calculateServiceCharge().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹ {(calculateTotal() + calculateServiceCharge()).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 font-medium">Paid by</p>
                  <div className="flex gap-2 mb-4">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">Cash</Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Card
                    </Button>
                  </div>

                  <div className="flex justify-between mb-4">
                    <span>Paid Amount:</span>
                    <span>₹ 0.00</span>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">Place Order</Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={clearCart}>
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
