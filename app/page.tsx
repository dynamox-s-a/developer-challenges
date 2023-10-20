import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TopCards from "@/components/TopCards";
import BarChart from "@/components/BarChart";

export default function Home() {
  return (
    <>
      <main className="bg-gray-100 min-h-screen">
        <Sidebar />
        <Header />
        <TopCards />
        <BarChart/>
      </main>
    </>
  );
}
