import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/content/content-page-view";
import { getContentPage, getContentSlugs } from "@/services/pages";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getContentSlugs("legal")).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: (await getContentPage(`legal/${slug}`))?.title };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = await getContentPage(`legal/${slug}`);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
