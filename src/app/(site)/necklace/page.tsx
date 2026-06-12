import { getProducts } from "@/lib/content";
import NecklaceView from "@/components/site/NecklaceView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kalung Solidaritas" };

export default async function NecklacePage() {
  const products = await getProducts(true);
  return <NecklaceView products={products} />;
}
