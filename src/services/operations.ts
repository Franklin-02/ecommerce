/** Async access to operational data. As with catalog.ts, a real API replaces these bodies. */
import { brands, categories } from "@/data/categories";
import { customers } from "@/data/customers";
import { employees, employeeTasks } from "@/data/employees";
import { inventory } from "@/data/inventory";
import { banners, coupons, promotions } from "@/data/marketing";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import { categorySales, dailySales, notifications } from "@/data/sales";
import type { Brand, Category, Product } from "@/types/catalog";
import type {
  BannerSlot,
  CategorySales,
  Coupon,
  Customer,
  DailySales,
  Employee,
  EmployeeTask,
  InventoryItem,
  Notification,
  Order,
  Promotion,
  Review,
} from "@/types/commerce";

export const getAllProducts = async (): Promise<Product[]> => products;
export const getAllCategories = async (): Promise<Category[]> => categories;
export const getAllBrands = async (): Promise<Brand[]> => brands;
export const getOrders = async (): Promise<Order[]> => orders;
export const getCustomers = async (): Promise<Customer[]> => customers;
export const getEmployees = async (): Promise<Employee[]> => employees;
export const getEmployeeTasks = async (): Promise<EmployeeTask[]> => employeeTasks;
export const getInventory = async (): Promise<InventoryItem[]> => inventory;
export const getCoupons = async (): Promise<Coupon[]> => coupons;
export const getPromotions = async (): Promise<Promotion[]> => promotions;
export const getBanners = async (): Promise<BannerSlot[]> => banners;
export const getDailySales = async (): Promise<DailySales[]> => dailySales;
export const getCategorySales = async (): Promise<CategorySales[]> => categorySales;
export const getNotifications = async (): Promise<Notification[]> => notifications;

export async function getProductReviews(productId: string): Promise<Review[]> {
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
