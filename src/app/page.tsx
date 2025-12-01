import { getPortfolioData } from "@/lib/data";
import PortfolioApp from "@/features/portfolio/components/portfolio-app";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getPortfolioData();

  return <PortfolioApp data={data} />;
}
