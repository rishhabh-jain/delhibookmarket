import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CategoryNav from "@/components/home/category-nav";
import HomePageCarousel from "@/components/carousels/home-page-carousel";
import { selfHelpBooks } from "@/app/data/self-help-books";
import { fictionBooks } from "@/app/data/fiction-books";
import { mangaBooks } from "@/app/data/manga-books";
import { financeBooks } from "@/app/data/finance-books";
import { businessBooks } from "@/app/data/business-books";
import { comboBooks } from "@/app/data/combo";
import { romanceBooks } from "@/app/data/romance-books";
import UserReviews from "@/components/home/UserReviews";
import Footer from "@/components/home/Footer";
import { SideCart } from "@/components/cart/sideCart";
import { Chaty } from "@/components/header-footer/Chaty";
import BookSearchBar from "@/components/search/Searchbar";
import Header from "@/components/header-footer/Header";

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Flash Sale Banner */}
      <section className="container mx-auto px-4 lg:px-6 my-2">
        <Card className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-600 border-0 shadow-2xl">
          <CardContent className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Flash icon and text */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg ring-2 ring-yellow-200/50">
                    <div className="text-center">
                      <Zap className="h-4 w-4 mx-auto text-red-600 fill-current" />
                      <span className="text-[10px] font-black text-red-600 tracking-tight">
                        FLASH
                      </span>
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-yellow-300 animate-pulse shadow-sm"></div>
                  <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping"></div>
                </div>

                <div className="text-white">
                  <h2 className="text-xl lg:text-2xl font-black tracking-tight">
                    LIMITED TIME OFFER
                  </h2>
                  <p className="text-sm text-red-100 font-medium">
                    Grab your favorite books now!
                  </p>
                </div>
              </div>

              {/* Right side - Price and CTA */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-sm font-bold text-yellow-300">₹</span>
                    <span className="text-3xl lg:text-4xl font-black text-yellow-300 tracking-tight">
                      99
                    </span>
                  </div>
                  <p className="text-xs font-bold text-red-100 tracking-wide">
                    SELECTED BOOKS
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-300 hover:to-yellow-200 font-black px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-yellow-200/50"
                >
                  SHOP NOW
                </Button>
              </div>
            </div>
          </CardContent>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-700/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        </Card>
      </section>

      {/* Category Navigation */}
      <section className="container mx-auto px-4 lg:px-6 py-4">
        <CategoryNav />
      </section>

      {/* Book Categories */}
      <div className="space-y-12 pb-12">
        {/* Self Help Books */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Self Help Books
            </h2>
            <p className="text-gray-600">
              Transform your life with these inspiring reads
            </p>
          </div>
          <HomePageCarousel products={selfHelpBooks} />
        </section>

        {/* Twisted Series Highlight */}
        <section className="container mx-auto px-4 lg:px-6">
          <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-0">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  The Twisted Series
                </h2>
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
              </div>
              <p className="text-indigo-200 text-lg">
                Dive into the captivating world of twisted romance
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Fiction Books */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Fiction Books
            </h2>
            <p className="text-gray-600">
              Escape into worlds of imagination and wonder
            </p>
          </div>
          <HomePageCarousel products={fictionBooks} />
        </section>

        {/* Demon Slayer Box Set */}
        <section className="container mx-auto px-4 lg:px-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-400 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-gray-900">
                Demon Slayer Box Set
              </h2>
              <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
                {/* <div className="relative">
                  <Image
                    src="/placeholder.svg?height=250&width=200"
                    alt="Demon Slayer Box Set"
                    width={200}
                    height={250}
                    className="rounded-lg shadow-xl"
                  />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                    LIMITED
                  </Badge>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=250&width=200"
                    alt="Demon Slayer Collection"
                    width={200}
                    height={250}
                    className="rounded-lg shadow-xl"
                  />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                    SALE
                  </Badge>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Manga Books */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Manga Collection
            </h2>
            <p className="text-gray-600">
              Discover the art of Japanese storytelling
            </p>
          </div>
          <HomePageCarousel products={mangaBooks} />
        </section>

        {/* Poster Promotion */}
        <section className="container mx-auto px-4 lg:px-6">
          <Card className="relative overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <CardContent className="px-4 ">
              <div className="flex flex-col lg:flex-row items-center justify-between ">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    FUEL YOUR WALLS WITH
                  </h3>
                  <h2 className="text-3xl lg:text-4xl font-bold text-green-600 mb-4">
                    INSPIRATION
                  </h2>
                  <p className="text-xl font-bold text-gray-900">
                    POSTERS STARTING AT ₹99
                  </p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Shop Posters
                  </Button>
                </div>
                <div className="flex gap-4">
                  {/* <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=140"
                      alt="Motivational Poster"
                      width={140}
                      height={200}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=140"
                      alt="Inspirational Wall Art"
                      width={140}
                      height={200}
                      className="rounded-lg shadow-lg"
                    />
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Finance Books */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Finance Books
            </h2>
            <p className="text-gray-600">Master your money and build wealth</p>
          </div>
          <HomePageCarousel products={financeBooks} />
        </section>

        {/* Business Books */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Business Books
            </h2>
            <p className="text-gray-600">
              Learn from the worlds most successful entrepreneurs
            </p>
          </div>
          <HomePageCarousel products={businessBooks} />
        </section>

        {/* Combo Deals */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Special Combos
            </h2>
            <p className="text-gray-600">
              Save more with our curated book bundles
            </p>
          </div>
          <HomePageCarousel products={comboBooks} />
        </section>

        {/* Romance Books */}
        <section className="container mx-auto px-4 lg:px-6">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Romance Books
            </h2>
            <p className="text-gray-600">
              Fall in love with these heartwarming stories
            </p>
          </div>
          <HomePageCarousel products={romanceBooks} />
        </section>
      </div>

      <div className="">
        <UserReviews />
      </div>

      <div className="">
        <Footer />
      </div>

      {/* Chat Button */}
      <Chaty />
    </main>
  );
}
