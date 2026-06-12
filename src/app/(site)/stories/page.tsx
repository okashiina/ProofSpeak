import { getApprovedStories } from "@/lib/content";
import StoriesView from "@/components/site/StoriesView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cerita" };

export default async function StoriesPage() {
  const stories = await getApprovedStories();
  return <StoriesView stories={stories} />;
}
