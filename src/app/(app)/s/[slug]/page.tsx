import { Suspense } from "react";
import SearchClient from "./SearchClient";
import Header from "@/components/header-footer/Header";
import Footer from "@/components/home/Footer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SearchPage({ params }: Props) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for {decodedSlug}
        </h1>
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <SearchClient searchQuery={decodedSlug} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
