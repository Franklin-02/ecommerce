import { homeContent } from "@/data/home";
import type { HomeContent } from "@/types/content";

export async function getHomeContent(): Promise<HomeContent> {
  return homeContent;
}
