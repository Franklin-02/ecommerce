import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/content/content-page-view";
import { getContentPage } from "@/services/pages";

export const metadata: Metadata = { title: "Help centre" };

export default async function HelpPage() {
  const page = await getContentPage("help");
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
