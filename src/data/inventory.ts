import type { InventoryItem } from "@/types/commerce";
import { products } from "./products";
import { seededRandom } from "./seed";

const random = seededRandom(2288);

export const inventory: InventoryItem[] = products.map((product, index) => {
  const reorderPoint = product.price > 500 ? 15 : product.price > 100 ? 25 : 60;
  const low = product.stock <= reorderPoint;
  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    image: product.images[0],
    categoryId: product.categoryId,
    brandName: product.brandName,
    onHand: product.stock,
    reserved: Math.min(product.stock, Math.floor(random() * 9)),
    reorderPoint,
    incoming: low ? reorderPoint * 2 + Math.floor(random() * 40) : 0,
    bin: `${"ABCDEF"[index % 6]}${1 + (index % 8)}-${String(10 + index).padStart(2, "0")}`,
    costPrice: Math.round(product.price * (0.55 + random() * 0.15) * 100) / 100,
  };
});
