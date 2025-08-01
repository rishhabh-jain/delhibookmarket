"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ShoppingCart, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  permalink: string;
  price: string;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  stock_quantity: number;
  slug: string;
}

export default function BookSearchBar() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Simulate loading products (replace with actual data loading)
  useEffect(() => {
    // Load the optimized search index
    fetch("/data/search-index.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Advanced search with multiple criteria
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowResults(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    const searchLower = searchTerm.toLowerCase();

    const filtered = products
      .filter((product) => {
        const bookTitle = extractBookTitle(product.name);
        const author = extractAuthor(product.name);

        return (
          bookTitle.toLowerCase().includes(searchLower) ||
          author.toLowerCase().includes(searchLower) ||
          product.slug.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        // Prioritize exact matches and in-stock items
        const aTitle = extractBookTitle(a.name).toLowerCase();
        const bTitle = extractBookTitle(b.name).toLowerCase();

        if (aTitle.startsWith(searchLower) && !bTitle.startsWith(searchLower))
          return -1;
        if (!aTitle.startsWith(searchLower) && bTitle.startsWith(searchLower))
          return 1;
        if (a.stock_quantity > 0 && b.stock_quantity === 0) return -1;
        if (a.stock_quantity === 0 && b.stock_quantity > 0) return 1;

        return 0;
      })
      .slice(0, 8);

    setFilteredProducts(filtered);
    setShowResults(true);
    setSelectedIndex(-1);
    setIsLoading(false);
  }, [searchTerm, products]);

  // Extract book title from full product name
  const extractBookTitle = (fullName: string) => {
    const match = fullName.match(/Buy (.+?) by/);
    return match ? match[1] : fullName.replace("Buy ", "");
  };

  // Extract author from full product name
  const extractAuthor = (fullName: string) => {
    const match = fullName.match(/by (.+?) \(/);
    return match ? match[1] : "";
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || filteredProducts.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          window.open(filteredProducts[selectedIndex].permalink, "_blank");
        }
        break;
      case "Escape":
        setShowResults(false);
        setSelectedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
    searchRef.current?.focus();
  };

  const handleProductClick = (product: Product) => {
    router.push(`/${product.slug}`);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl my-2" ref={resultsRef}>
      {/* Search Input */}
      <div className="relative ">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search for books, authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => filteredProducts.length > 0 && setShowResults(true)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-5 w-5 text-gray-400" />
            {""}
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && !isLoading && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {filteredProducts.map((product, index) => {
            const bookTitle = extractBookTitle(product.name);
            const author = extractAuthor(product.name);

            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`flex items-center p-4 cursor-pointer transition-all duration-150 ${
                  index === selectedIndex
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                } ${
                  index !== filteredProducts.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                {/* Book Cover */}
                <div className="flex-shrink-0 w-12 h-16 mr-4">
                  <img
                    src={product.images[0]?.src}
                    alt={product.images[0]?.alt || bookTitle}
                    className="w-full h-full object-cover rounded shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxNkMyNi4yMDkxIDE2IDI4IDE3Ljc5MDkgMjggMjBWNDRDMjggNDYuMjA5MSAyNi4yMDkxIDQ4IDI0IDQ4QzIxLjc5MDkgNDggMjAgNDYuMjA5MSAyMCA0NFYyMEMyMCAxNy43OTA5IDIxLjc5MDkgMTYgMjQgMTZaIiBmaWxsPSIjRDFENUQ5Ii8+Cjx0ZXh0IHg9IjI0IiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iIzlDQTNBRiI+Qm9vazwvdGV4dD4KPC9zdmc+";
                    }}
                  />
                </div>

                {/* Book Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {bookTitle}
                  </h3>
                  {author && (
                    <p className="text-sm text-gray-600 truncate">
                      by {author}
                    </p>
                  )}
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.stock_quantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock_quantity > 0
                        ? `${product.stock_quantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Action Icons */}
                <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            );
          })}

          {/* Show more results indicator */}
          {filteredProducts.length === 8 && (
            <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
              Showing top 8 results. Try a more specific search for better
              matches.
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showResults &&
        !isLoading &&
        searchTerm &&
        filteredProducts.length === 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-lg z-50 p-6 text-center">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No books found</p>
              <p className="text-sm mt-1">
                Try searching with different keywords or author names
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
