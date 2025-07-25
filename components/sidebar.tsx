"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ShoppingCart,
  ClipboardList,
  Settings,
  Wallet,
  MessageSquare,
  FileBarChart,
  Store,
  LogOut,
  Menu,
  X,
  Pizza,
  TicketSlash,
  UserSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const routes = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Items",
    icon: Pizza,
    href: "/items",
    color: "text-purple-500",
  },
  // {
  //   label: "Point of Sale",
  //   icon: ShoppingCart,
  //   href: "/point-of-sale",
  //   color: "text-violet-500",
  // },
  {
    label: "Orders",
    icon: ClipboardList,
    href: "/orders",
    color: "text-pink-700",
  },
  {
    label: "Restaurant Config",
    icon: Settings,
    href: "/restaurant-config",
    color: "text-orange-500",
  },
  {
    label: "My Wallet",
    icon: Wallet,
    href: "/wallet",
    color: "text-emerald-500",
  },
  {
    label: "Transaction Reports",
    icon: FileBarChart,
    href: "/transaction-reports",
    color: "text-blue-500",
  },
  {
    label: "Order Reports",
    icon: ClipboardList,
    href: "/order-reports",
    color: "text-yellow-500",
  },
  {
    label: "Campaign Reports",
    icon: FileBarChart,
    href: "/campaign-reports",
    color: "text-red-500",
  },
  {
    label: "Refunds",
    icon: TicketSlash,
    href: "/refunds",
    color: "text-purple-500",
  },
  {
    label: "Chat",
    icon: MessageSquare,
    href: "/chat",
    color: "text-green-500",
  },
  {
    label: "Profile",
    icon: Store,
    href: "/profile",
    color: "text-purple-500",
  },
  {
    label: "Contact Support",
    icon: UserSearch,
    href: "/contact-support",
    color: "text-purple-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { restaurant, logout } = useAuth();

  return (
    <>
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
          >
            <Menu />

            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="h-full flex flex-col">
            <div className="px-3 py-4 flex items-center border-b">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-orange-500" />
                <span className="font-bold text-xl">ELFO&apos;S PIZZA</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                      pathname === route.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={restaurant?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {restaurant?.name?.substring(0, 2) || "EP"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {restaurant?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {restaurant?.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Fixed Position */}
      <div className="hidden md:flex flex-col h-screen w-64 border-r bg-background fixed left-0 top-0 z-10">
        <div className="px-3 py-4 flex items-center border-b">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-xl">ELFO&apos;S PIZZA</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={restaurant?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {restaurant?.name?.substring(0, 2) || "EP"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{restaurant?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {restaurant?.id}
              </p>
            </div>
          <Button
  variant="ghost"
  size="icon"
  onClick={() => setShowLogoutConfirm(true)}
  title="Logout"
>
  <LogOut className="h-4 w-4" />
</Button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed sidebar on desktop */}
      <div className="hidden md:block w-64 flex-shrink-0"></div>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
  <DialogContent className="max-w-sm">
    <DialogHeader>
      <DialogTitle>Confirm Logout</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <p>Are you sure you want to log out?</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setShowLogoutConfirm(false);
            logout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </>
  );
}
