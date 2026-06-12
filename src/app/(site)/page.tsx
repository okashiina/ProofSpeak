import { getProducts, getStats } from "@/lib/content";
import HomeView from "@/components/site/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, stats] = await Promise.all([getProducts(true), getStats()]);
  return <HomeView products={products} stats={stats} />;
}
