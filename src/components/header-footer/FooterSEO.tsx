import Link from "next/link"

export default function FooterSEO() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About DelhibookMarket */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Delhibookmarket.com - Buy Books Online at Best Prices in India
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Welcome to DelhibookMarket, your only destination for buying books across all categories at very
              affordable prices. Whether you&apos;re into fiction, non-fiction, self-help, manga, business/finance, romance,
              box sets, or any other genre, we&apos;ve got it all. If you&apos;re searching for the cheapest books online, you&apos;re
              at the right place.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              With over 100,000 happy customers and more than 10,000 verified reviews, DelhibookMarket is proud to be
              one of the most trusted platforms for book lovers.
            </p>

              <div className="mb-6">
            <p className="text-muted-foreground leading-relaxed mb-6">
              At DelhibookMarket, we believe in providing a best experience for book enthusiasts. Here&apos;s why buying
              books from us is the best choice:
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">1. Fast and Free Delivery</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enjoy fast delivery straight to your doorstep, completely free of charge above order above 499/-, no
                  matter where you are.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">3. Excellent Customer Support</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  Our team is always here to help! Whether you need assistance placing an order or have a query about
                  your purchase, you can:
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Email us at support@delhibookmarket.com DM us on Instagram: @delhibookmarket.in Call our customer care
                  team directly for quick support.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">4. Exciting Freebies with Every Order</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get a beautifully designed bookmark with every purchase, even if you buy just one book! Plus, when
                  your order is over ₹599, you&apos;ll receive a free diary
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">5. Affordable Pricing Across All Categories</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  From self-help books to fiction, non-fiction, and business/finance, we ensure all our books are
                  affordable for every customer so you can enjoy the joy of reading without thinking about the money
                </p>
              </div>
            </div>
          </div>
          </div>


        

          {/* Bestselling Books */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-red-500 mb-4">Best selling book of all time on delhibookmarket</h3>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-foreground leading-relaxed">
                  Looking for the perfect read? At DelhibookMarket, we&apos;ve got you covered with the best-selling books
                  from every genre you can imagine. Whether you&apos;re diving into life-changing self-help books, sharpening
                  your skills with business and trading books, falling in love with romantic novels, or unraveling
                  suspense in mystery and thriller books, you&apos;ll find it all here.
                </p>

                <p className="text-sm text-foreground leading-relaxed">
                  These books aren&apos;t just popular—they&apos;re tried, tested, and loved by thousands of readers across India.
                  Whether you&apos;re a seasoned bookworm or someone just starting their reading journey, our collection has
                  something for everyone.
                </p>

                <p className="text-sm text-foreground leading-relaxed">
                  Check out our curated list of the top-selling books that customers rave about. Shop now on
                  DelhibookMarket and discover why these books are flying off the shelves. Happy reading! 📚
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/book/buy-i-dont-love-you-anymore"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  Buy I Don&apos;t Love You Anymore
                </Link>
                <Link
                  href="/book/atomic-habits"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  Atomic Habits
                </Link>
                <Link
                  href="/book/ikigai"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  Ikigai
                </Link>
                <Link
                  href="/book/the-secret"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  The Secret
                </Link>
                <Link
                  href="/book/the-alchemist"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  The Alchemist
                </Link>
                <Link
                  href="/book/dopamine-detox"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  Dopamine Detox
                </Link>
                <Link
                  href="/book/art-of-being-alone"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  The Art of Being ALONE
                </Link>
                <Link
                  href="/book/mans-search-for-meaning"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  Man&apos;s Search For Meaning
                </Link>
                <Link
                  href="/book/art-of-laziness"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  The Art of Laziness
                </Link>
                <Link
                  href="/book/psychology-of-money"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  The Psychology of Money
                </Link>
                <Link
                  href="/book/dont-believe-everything-you-think"
                  className="block text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-rose-300 hover:decoration-rose-500"
                >
                  Don&apos;t Believe Everything You Think
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Book Genre */}
        <div className="border-t pt-4 mb-4">
          <h3 className="text-lg font-semibold text-red-500 mb-4">Most popular book genre on delhibookmarket</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-4 text-slate-100">
            <Link
              href="/category/finance"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">finance</span>
            </Link>
            <Link
              href="/category/self-help"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">self help</span>
            </Link>
            <Link
              href="/category/fiction"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">fiction</span>
            </Link>
            <Link
              href="/category/manga"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">manga</span>
            </Link>
            <Link
              href="/category/romance"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">romance</span>
            </Link>
            <Link
              href="/category/mystery"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">mystery</span>
            </Link>
            <Link
              href="/category/business"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">business</span>
            </Link>
            <Link
              href="/category/trading"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">trading</span>
            </Link>
            <Link
              href="/category/non-fiction"
              className="bg-orange-200 hover:bg-orange-300 transition-colors rounded-md px-3 py-2 text-center"
            >
              <span className="text-sm font-medium text-gray-800 underline">non-fiction</span>
            </Link>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            Explore all type of books in these genres in delhibookmarket top categories section
          </p>
        </div>

        {/* Why Choose DelhibookMarket */}
        <div className="border-t pt-8 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Why Choose DelhibookMarket?</h3>
          

          {/* Additional features in grid format */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Genuine Books</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We have a big collection of original books spread across all categories from romance to mystery, self
                help to business books we got you all covered.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Multiple Language and Formats</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We offer books across all languages whether it is Hindi, English or Spanish. Search the book name in the
                search bar to find books in your preferred language.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Trusted Platform</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                With over 100,000 happy customers and more than 10,000 verified reviews, DelhibookMarket is one of the
                most trusted platforms for book lovers.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t pt-8 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Should you trust delhibookmarket to buy books?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We have a loyal customer base of over 100000+ customers and 10000+ customer reviews, making
                delhibookmarket a recognized trustworthy platform to buy books.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Is Cash on Delivery (COD) available?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, we offer COD on all orders at an extra shipping fee of Rs40.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Can I exchange or return if books come damaged?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, we offer both exchange and returns on damaged books. You can read our return and exchange policy
                for more details.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">How much time does it take to deliver an order?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It usually takes 3-4 days to deliver an order outside Delhi and Delhi NCRs. For Delhi and Delhi NCRs,
                your order will be delivered in just 1-2 days.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="border-t pt-8 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">What Customers Say About DelhibookMarket</h3>
          <p className="text-muted-foreground leading-relaxed">
            We have over 100000+ happy and loyal customers and 100000+ happy customer reviews. You can see our customer
            highlights on our Instagram page @delhibookmarket.in. We also have a thriving book community where people
            share their beautiful order pics. You can see the customer highlights on our Instagram page for more
            information.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            ©DelhibookMarket.com. All rights reserved. | Trusted by 100,000+ book lovers across India
          </div>

        </div>
      </div>
    </footer>
  )
}
