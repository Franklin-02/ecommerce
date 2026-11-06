import { contentPages } from "@/data/content";
import type { ContentPage } from "@/types/content-pages";

export async function getContentPage(path: string): Promise<ContentPage | undefined> {
  return contentPages[path];
}

/** Last path segments of the content pages under a section, such as "legal". */
export async function getContentSlugs(section: string): Promise<string[]> {
  return Object.keys(contentPages)
    .filter((path) => path.startsWith(`${section}/`))
    .map((path) => path.slice(section.length + 1));
}

/** Content pages that sit at the top level of the site. */
export async function getTopLevelContentSlugs(): Promise<string[]> {
  return Object.keys(contentPages).filter((path) => !path.includes("/") && path !== "help");
}
