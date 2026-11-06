import { brands, categories } from "@/data/categories";
import { customers } from "@/data/customers";
import { employees, employeeTasks } from "@/data/employees";
import { banners, coupons, promotions } from "@/data/marketing";
import { products } from "@/data/products";
import { inventory } from "@/data/inventory";
import type { Brand, Category, Product } from "@/types/catalog";
import type {
  BannerSlot,
  Coupon,
  Customer,
  Employee,
  EmployeeTask,
  InventoryItem,
  Promotion,
} from "@/types/commerce";
import { createCollection } from "./collection";

type WithId<T> = T & { id: string };

export const productsCollection = createCollection<Product>("products", products);
export const categoriesCollection = createCollection<Category>("categories", categories);
export const brandsCollection = createCollection<Brand>("brands", brands);
export const customersCollection = createCollection<Customer>("customers", customers);
// "-v3" matches the session bump: employee records gained access/password, which sign-in reads.
export const employeesCollection = createCollection<Employee>("employees-v3", employees);
export const tasksCollection = createCollection<EmployeeTask>("tasks", employeeTasks);
export const couponsCollection = createCollection<Coupon>("coupons", coupons);
export const promotionsCollection = createCollection<Promotion>("promotions", promotions);
export const bannersCollection = createCollection<BannerSlot>("banners", banners);
export const inventoryCollection = createCollection<WithId<InventoryItem>>(
  "inventory",
  inventory.map((item) => ({ ...item, id: item.productId })),
);
