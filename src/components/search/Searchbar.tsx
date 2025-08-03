"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ExternalLink } from "lucide-react";
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

interface SearchResult extends Product {
  score: number;
  matchType: "exact" | "fuzzy" | "partial";
}

export default function BookSearchBar() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load products data
  useEffect(() => {
    fetch("/data/search-index.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Levenshtein distance calculation for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Calculate similarity score (0-1, where 1 is perfect match)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    const distance = levenshteinDistance(
      str1.toLowerCase(),
      str2.toLowerCase()
    );
    return (maxLength - distance) / maxLength;
  };

  // Check for transposition (adjacent character swap)
  const hasTransposition = (str1: string, str2: string): boolean => {
    if (Math.abs(str1.length - str2.length) > 1) return false;

    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    let differences = 0;
    let transpositionFound = false;

    for (let i = 0; i < Math.min(s1.length, s2.length) - 1; i++) {
      if (s1[i] !== s2[i]) {
        differences++;
        // Check for adjacent swap
        if (!transpositionFound && i < s1.length - 1 && i < s2.length - 1) {
          if (s1[i] === s2[i + 1] && s1[i + 1] === s2[i]) {
            transpositionFound = true;
            i++; // Skip next character as it's part of the transposition
            continue;
          }
        }
      }
    }

    return transpositionFound && differences <= 2;
  };

  // Normalize text for better matching
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  };

  // Check if query matches with word boundaries
  const wordBoundaryMatch = (text: string, query: string): boolean => {
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    const words = normalizedText.split(" ");

    return words.some(
      (word) =>
        word.startsWith(normalizedQuery) ||
        calculateSimilarity(word, normalizedQuery) > 0.7
    );
  };

  // Check if product is a combo/series/set
  const isComboProduct = (product: Product): boolean => {
    return /(\+|combo|bundle|set|collection|series|box|boxset|complete|volume|pack)/i.test(
      product.name
    );
  };

  // Smart combo query detection with fuzzy matching for partial words
  const isComboQuery = (query: string): boolean => {
    const normalizedQuery = normalizeText(query);
    const words = normalizedQuery.split(/\s+/);

    // Define combo keywords and their common variations/typos
    const comboPatterns = {
      set: ["set", "sets", "sett", "sete"],
      series: ["series", "serie", "seri", "ser", "seres", "seris"],
      combo: ["combo", "combos", "com", "comb", "compo"],
      bundle: ["bundle", "bundles", "bundl", "bund", "bundel"],
      collection: ["collection", "collections", "collect", "col", "collec"],
      box: ["box", "boxes", "boxs", "boxe"],
      boxset: ["boxset", "boxsets", "box set", "box sets"],
      complete: ["complete", "complet", "comp", "complte"],
      pack: ["pack", "packs", "pak", "packe"],
      volume: ["volume", "volumes", "vol", "vols", "volum"],
    };

    // Check each word in the query
    for (const word of words) {
      // Direct pattern matching for partial words
      for (const [mainKeyword, variations] of Object.entries(comboPatterns)) {
        // Check if word matches any variation exactly
        if (variations.some((variation) => variation === word)) {
          return true;
        }

        // Check if word is a prefix of any variation (for partial typing)
        if (
          variations.some(
            (variation) => variation.startsWith(word) && word.length >= 2
          )
        ) {
          return true;
        }

        // Fuzzy matching for typos (minimum 3 characters for fuzzy matching)
        if (word.length >= 3) {
          for (const variation of variations) {
            const similarity = calculateSimilarity(word, variation);
            // Lower threshold for shorter words, higher for longer ones
            const threshold = variation.length <= 4 ? 0.6 : 0.7;
            if (similarity >= threshold) {
              return true;
            }
          }
        }
      }
    }

    // Additional check for single character queries that might be starting combo words
    if (normalizedQuery.length === 1) {
      const singleCharStarters = ["s", "c", "b", "p", "v"]; // series, combo, box/bundle, pack, volume
      return singleCharStarters.includes(normalizedQuery);
    }

    // Check for two character queries
    if (normalizedQuery.length === 2) {
      const twoCharStarters = [
        "se",
        "sr",
        "co",
        "cm",
        "bo",
        "bx",
        "pa",
        "pk",
        "vo",
        "vl",
      ];
      return twoCharStarters.includes(normalizedQuery);
    }

    return false;
  };

  // Get combo query confidence level
  const getComboQueryConfidence = (query: string): number => {
    const normalizedQuery = normalizeText(query);
    const words = normalizedQuery.split(/\s+/);

    const exactComboKeywords = [
      "set",
      "sets",
      "series",
      "combo",
      "combos",
      "bundle",
      "bundles",
      "collection",
      "collections",
      "box",
      "boxes",
      "boxset",
      "boxsets",
      "complete",
      "pack",
      "packs",
      "volume",
      "volumes",
    ];

    // High confidence for exact matches
    if (words.some((word) => exactComboKeywords.includes(word))) {
      return 1.0;
    }

    // Medium confidence for partial matches and common typos
    const partialMatches = [
      "ser",
      "seri",
      "serie",
      "com",
      "comb",
      "boxe",
      "complet",
    ];
    if (words.some((word) => partialMatches.includes(word))) {
      return 0.8;
    }

    // Lower confidence for very short queries that might be combo-related
    if (
      normalizedQuery.length <= 2 &&
      ["s", "c", "b", "se", "co", "bo"].includes(normalizedQuery)
    ) {
      return 0.3;
    }

    return 0.0;
  };

  // Advanced fuzzy search function
  const fuzzySearch = (products: Product[], query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeText(query);
    const results: SearchResult[] = [];
    const isQueryForCombo = isComboQuery(query);
    const comboConfidence = getComboQueryConfidence(query);

    products.forEach((product) => {
      const bookTitle = normalizeText(extractBookTitle(product.name));
      const author = normalizeText(extractAuthor(product.name));
      const slug = normalizeText(product.slug.replace(/-/g, " "));
      const isProductCombo = isComboProduct(product);

      let bestScore = 0;
      let matchType: "exact" | "fuzzy" | "partial" = "partial";

      // Exact match check
      if (
        bookTitle.includes(normalizedQuery) ||
        author.includes(normalizedQuery)
      ) {
        bestScore = 1.0;
        matchType = "exact";
      }

      // Word boundary fuzzy matching
      else if (
        wordBoundaryMatch(bookTitle, normalizedQuery) ||
        wordBoundaryMatch(author, normalizedQuery)
      ) {
        bestScore = 0.9;
        matchType = "fuzzy";
      }

      // Character-level fuzzy matching
      else {
        const titleSimilarity = calculateSimilarity(bookTitle, normalizedQuery);
        const authorSimilarity = calculateSimilarity(author, normalizedQuery);
        const slugSimilarity = calculateSimilarity(slug, normalizedQuery);

        bestScore = Math.max(titleSimilarity, authorSimilarity, slugSimilarity);

        // Check for transpositions (common typos)
        if (bestScore < 0.6) {
          const titleWords = bookTitle.split(" ");
          const authorWords = author.split(" ");

          for (const word of [...titleWords, ...authorWords]) {
            if (hasTransposition(word, normalizedQuery)) {
              bestScore = Math.max(bestScore, 0.8);
              matchType = "fuzzy";
              break;
            }
          }
        }

        if (bestScore >= 0.6) {
          matchType = "fuzzy";
        }
      }

      // Enhanced combo/series logic with confidence levels
      if (isQueryForCombo) {
        // User is looking for combo products
        if (isProductCombo) {
          // Boost based on confidence level
          const boostMultiplier = 1.2 + comboConfidence * 0.8; // 1.2 to 2.0
          bestScore *= boostMultiplier;
        } else {
          // Penalty for single books, but less harsh for low confidence queries
          const penaltyMultiplier = comboConfidence > 0.7 ? 0.2 : 0.5;
          bestScore *= penaltyMultiplier;
        }
      } else {
        // User is NOT looking for combo products - prioritize single books
        if (isProductCombo) {
          bestScore *= 0.4; // Penalty for combo products
        } else {
          bestScore *= 1.2; // Boost for single books
        }
      }

      // For very short queries that might be combo-related, show both types but prefer combos
      if (
        normalizedQuery.length <= 3 &&
        isQueryForCombo &&
        comboConfidence <= 0.5
      ) {
        if (isProductCombo) {
          bestScore *= 1.3; // Moderate boost for combos
        }
        // Don't penalize single books as much for ambiguous short queries
      }

      // Boost score for in-stock items
      if (product.stock_quantity > 0) {
        bestScore *= 1.1;
      }

      // Dynamic threshold based on query length and combo confidence
      let threshold = 0.4;
      if (isQueryForCombo) {
        // Lower threshold for combo queries to show more results
        threshold = comboConfidence > 0.7 ? 0.3 : 0.35;
      }

      if (bestScore > threshold) {
        results.push({
          ...product,
          score: bestScore,
          matchType,
        });
      }
    });

    // Enhanced sorting logic
    return results
      .sort((a, b) => {
        const aIsCombo = isComboProduct(a);
        const bIsCombo = isComboProduct(b);

        // If user is searching for combo products
        if (isQueryForCombo) {
          // Strong preference for combo products when confidence is high
          if (comboConfidence > 0.7) {
            if (aIsCombo && !bIsCombo) return -1;
            if (!aIsCombo && bIsCombo) return 1;
          }
          // Moderate preference when confidence is medium
          else if (comboConfidence > 0.3) {
            const aComboBonus = aIsCombo ? 0.2 : 0;
            const bComboBonus = bIsCombo ? 0.2 : 0;
            const adjustedScoreDiff =
              b.score + bComboBonus - (a.score + aComboBonus);
            if (Math.abs(adjustedScoreDiff) > 0.1) return adjustedScoreDiff;
          }
        } else {
          // User is NOT searching for combo products - prioritize single books
          if (aIsCombo && !bIsCombo) return 1;
          if (!aIsCombo && bIsCombo) return -1;
        }

        // Prioritize exact matches, then fuzzy, then partial
        const typeScore = { exact: 3, fuzzy: 2, partial: 1 };
        const typeDiff = typeScore[b.matchType] - typeScore[a.matchType];
        if (typeDiff !== 0) return typeDiff;

        // Then by similarity score
        const scoreDiff = b.score - a.score;
        if (Math.abs(scoreDiff) > 0.1) return scoreDiff;

        // Finally by stock availability
        return (b.stock_quantity > 0 ? 1 : 0) - (a.stock_quantity > 0 ? 1 : 0);
      })
      .slice(0, 10); // Show more results for combo queries
  };

  // Advanced search with debouncing
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowResults(false);
      setSelectedIndex(-1);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Shorter debounce for better responsiveness with smart matching
    const timeoutId = setTimeout(() => {
      const results = fuzzySearch(products, searchTerm);
      setFilteredProducts(results);
      setShowResults(true);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timeoutId);
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

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);

    // Simple highlighting for exact matches
    const regex = new RegExp(`(${normalizedQuery})`, "gi");
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  const getMatchTypeColor = (matchType: "exact" | "fuzzy" | "partial") => {
    switch (matchType) {
      case "exact":
        return "text-green-600";
      case "fuzzy":
        return "text-blue-600";
      case "partial":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  // Get search suggestion text
  const getSearchSuggestionText = () => {
    const isQueryForCombo = isComboQuery(searchTerm);
    const confidence = getComboQueryConfidence(searchTerm);

    if (isQueryForCombo && confidence > 0.3) {
      return "Smart search detected: Looking for sets, series, or combos";
    }
    return "";
  };

  return (
    <div className="relative w-full max-w-2xl my-2" ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search books, authors, sets, series... Try: 'ser', 'com', 'boxe', 'sett'"
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

      {/* Smart Search Indicator */}
      {searchTerm && isComboQuery(searchTerm) && (
        <div className="mt-1 text-xs text-purple-600 flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
          {getSearchSuggestionText()}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Smart searching...</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && !isLoading && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {filteredProducts.map((product, index) => {
            const bookTitle = extractBookTitle(product.name);
            const author = extractAuthor(product.name);
            const isProductCombo = isComboProduct(product);

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
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-semibold text-gray-900 truncate text-sm"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(bookTitle, searchTerm),
                      }}
                    />
                    {isProductCombo && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-medium">
                        Set
                      </span>
                    )}
                  </div>
                  {author && (
                    <p
                      className="text-sm text-gray-600 truncate"
                      dangerouslySetInnerHTML={{
                        __html: `by ${highlightMatch(author, searchTerm)}`,
                      }}
                    />
                  )}
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getMatchTypeColor(
                        product.matchType
                      )} bg-gray-100`}
                    >
                      {product.matchType === "exact"
                        ? "Exact"
                        : product.matchType === "fuzzy"
                        ? "Smart Match"
                        : "Similar"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(product.score * 100)}% match
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
          {filteredProducts.length === 10 && (
            <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
              {isComboQuery(searchTerm)
                ? "Showing top smart matches for sets and series. Try more specific terms for better results."
                : "Showing top 10 smart matches. Try a more specific search for better results."}
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
                {isComboQuery(searchTerm) && (
                  <>
                    <br />
                    <span className="text-purple-600">
                      Looking for sets/series? Try: &quot;harry potter
                      set&quot;, &quot;series&quot;, or author names.
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
