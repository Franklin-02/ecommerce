import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/content/content-page-view";
import { getContentPage, getTopLevelContentSlugs } from "@/services/pages";

interface Props {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  return (await getTopLevelContentSlugs()).map((page) => ({ page }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return { title: (await getContentPage(page))?.title };
}

/** Company pages such as /about. Static routes like /cart take priority over this. */
export default async function TopLevelContentPage({ params }: Props) {
  const { page: slug } = await params;
  const page = await getContentPage(slug);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
