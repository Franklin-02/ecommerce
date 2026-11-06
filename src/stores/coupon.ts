import { createPersistedStore, useStore } from "@/lib/store";
import type { Coupon } from "@/types/commerce";

/** The coupon entered in the cart, carried through to checkout. */
const couponStore = createPersistedStore<Coupon | null>("ohmly.coupon.v2", null);

export const applyCoupon = (coupon: Coupon) => couponStore.set(coupon);
export const removeCoupon = () => couponStore.set(null);
export const useAppliedCoupon = () => useStore(couponStore);
