/** Operational domain types: orders, people, marketing and inventory. */

export type OrderStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "upi" | "card" | "netbanking" | "emi" | "cod";
export type PaymentStatus = "paid" | "pending" | "refunded";
export type DeliveryMethod = "standard" | "next-day" | "pickup";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderEvent {
  status: OrderStatus;
  at: string;
  note?: string;
  by?: string;
}

export interface Order {
  id: string;
  /** Customer-facing reference, e.g. KCM-104821. */
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  placedAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  /** GST already included in `total`; never added on top. */
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: Address;
  assignedToId?: string;
  timeline: OrderEvent[];
}

export type CustomerTier = "Standard" | "Plus" | "Pro";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  tier: CustomerTier;
  status: "active" | "blocked";
  addresses: Address[];
}

export type EmployeeRole =
  | "Store Manager"
  | "Fulfillment Lead"
  | "Fulfillment Associate"
  | "Inventory Specialist"
  | "Customer Support"
  | "Marketing Manager";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: "Operations" | "Fulfillment" | "Inventory" | "Support" | "Marketing";
  status: "active" | "on-leave" | "inactive";
  joinedAt: string;
  shift: string;
  location: string;
  /** Which portal this person signs in to. Absent means "employee". */
  access?: "admin" | "employee";
  /** Sign-in password, plain text because this is mock data. Absent means the demo default. */
  password?: string;
}

export interface EmployeeTask {
  id: string;
  assigneeId: string;
  title: string;
  kind: "pick-pack" | "stock-count" | "customer-callback" | "returns" | "restock";
  priority: "high" | "medium" | "low";
  dueAt: string;
  done: boolean;
  orderId?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export type CampaignStatus = "active" | "scheduled" | "expired" | "paused";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  minSpend: number;
  usageCount: number;
  usageLimit: number;
  startsAt: string;
  endsAt: string;
  status: CampaignStatus;
}

export interface Promotion {
  id: string;
  name: string;
  kind: "Flash sale" | "Seasonal" | "Bundle" | "Clearance";
  discountLabel: string;
  categoryIds: string[];
  startsAt: string;
  endsAt: string;
  status: CampaignStatus;
  revenue: number;
}

export interface BannerSlot {
  id: string;
  title: string;
  placement: "Homepage hero" | "Homepage tile" | "Homepage promo" | "Category header";
  image: string;
  href: string;
  startsAt: string;
  endsAt: string;
  status: CampaignStatus;
  clicks: number;
  impressions: number;
}

export interface InventoryItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  categoryId: string;
  brandName: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  incoming: number;
  bin: string;
  costPrice: number;
}

export type StockState = "in-stock" | "low" | "out";

export interface DailySales {
  /** ISO date. */
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface CategorySales {
  categoryId: string;
  name: string;
  revenue: number;
  units: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  kind: "order" | "stock" | "customer" | "system";
}
