import { Suspense } from "react";
import { NextSeo } from "next-seo";
import { HomeLayout } from "src/layouts/home";

export default function Home() {
  return (
    <Suspense fallback={`Loading...`}>
      <NextSeo title="Dynamox" description="Ladding Page" />
      <HomeLayout />
    </Suspense>
  );
}
