import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/content/content-page-view";
import { getContentPage, getContentSlugs } from "@/services/pages";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return (await getContentSlugs("help")).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  return { title: (await getContentPage(`help/${topic}`))?.title };
}

export default async function HelpTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = await getContentPage(`help/${topic}`);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
