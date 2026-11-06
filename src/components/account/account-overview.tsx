"use client";

import { ArrowRight, Heart, LifeBuoy, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAddresses, useSession } from "@/stores/auth";
import { useWishlist } from "@/stores/wishlist";
import { OrderCard, useCustomerOrders } from "./order-card";

const RECENT_ORDERS = 3;
const FINISHED = ["delivered", "cancelled", "returned"];

const quickLinks = [
  { label: "Edit profile", href: "/account/profile", icon: User },
  { label: "Manage addresses", href: "/account/addresses", icon: MapPin },
  { label: "View wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Get help", href: "/help", icon: LifeBuoy },
];

export function AccountOverview() {
  const session = useSession();
  const orders = useCustomerOrders();
  const wishlistCount = useWishlist().length;
  const addressCount = useAddresses().length;

  const stats = [
    { label: "Orders placed", value: orders.length },
    { label: "In progress", value: orders.filter((order) => !FINISHED.includes(order.status)).length },
    { label: "Saved items", value: wishlistCount },
    { label: "Addresses", value: addressCount },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Hi, {session?.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-ink-500">Here&apos;s what&apos;s happening with your account.</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-card border border-line p-4">
            <dt className="text-sm text-ink-600">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink-950">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="recent-orders" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-orders" className="text-lg font-semibold tracking-tight text-ink-950">
            Recent orders
          </h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-800 hover:text-brand-600">
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
        {orders.length === 0 ? (
          <div className="rounded-card border border-line">
            <EmptyState
              icon={Package}
              title="No orders yet"
              body="When you place an order, you can track it here."
              action={<ButtonLink href="/categories">Start shopping</ButtonLink>}
            />
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, RECENT_ORDERS).map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="quick-links" className="mt-8">
        <h2 id="quick-links" className="mb-3 text-lg font-semibold tracking-tight text-ink-950">
          Quick links
        </h2>
        <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex h-full items-center gap-3 rounded-card border border-line p-4 text-sm font-medium text-ink-950 transition-colors hover:border-line-strong hover:text-brand-600"
              >
                <link.icon className="size-5 shrink-0 text-brand-600" aria-hidden />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
